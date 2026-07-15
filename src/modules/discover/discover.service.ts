import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/user";
import { UserSkill } from "@/models/userSkill";
import { Skill } from "@/models/skill";
import { computeSkillSimilarity, type MatchReason } from "@/lib/skillSimilarity";
import mongoose from "mongoose";

export interface MatchedUser {
  id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  rating: number;
  reviewCount: number;
  completedSwaps: number;
  trustScore: number;
  matchScore: number;
  iCanTeachTheyWant: number;
  theyCanTeachIWant: number;
  reasons: MatchReason[];
  userSkills: { skill: { name: string }; type: string }[];
}

export async function findMatches(userId: string): Promise<MatchedUser[]> {
  await connectDB();

  const user = await User.findById(userId).lean();
  if (!user) return [];

  const myUserSkills = await UserSkill.find({ userId }).populate("skillId", "name").lean();
  const myTeachSkills = myUserSkills
    .filter((s) => s.type === "teach")
    .map((s) => (s.skillId as any).name as string);
  const myLearnSkills = myUserSkills
    .filter((s) => s.type === "learn")
    .map((s) => (s.skillId as any).name as string);

  const allUsers = await User.find({
    _id: { $ne: new mongoose.Types.ObjectId(userId) },
    isProfileComplete: true,
  }).lean();

  const allUserIds = allUsers.map((u) => u._id);
  const allUserSkills = await UserSkill.find({ userId: { $in: allUserIds } })
    .populate("skillId", "name")
    .lean();

  const userSkillsMap = new Map<string, { teach: string[]; learn: string[] }>();
  allUserSkills.forEach((us) => {
    const uid = us.userId.toString();
    const skillName = (us.skillId as any).name as string;
    if (!userSkillsMap.has(uid)) {
      userSkillsMap.set(uid, { teach: [], learn: [] });
    }
    const entry = userSkillsMap.get(uid)!;
    if (us.type === "teach") entry.teach.push(skillName);
    else entry.learn.push(skillName);
  });

  const scored: MatchedUser[] = [];

  for (const other of allUsers) {
    const otherId = other._id.toString();
    const otherSkills = userSkillsMap.get(otherId) || { teach: [], learn: [] };

    let totalSim = 0;
    let matchCount = 0;
    const reasons: MatchReason[] = [];
    let iCanTeachTheyWant = 0;
    let theyCanTeachIWant = 0;

    for (const want of otherSkills.learn) {
      for (const canTeach of myTeachSkills) {
        const sim = computeSkillSimilarity(want, canTeach);
        if (sim > 0) {
          totalSim += sim;
          matchCount++;
          if (want.toLowerCase() === canTeach.toLowerCase()) {
            reasons.push({ type: "exact", from: canTeach, to: want });
          } else {
            reasons.push({ type: "related", from: canTeach, to: want });
          }
          if (sim >= 0.75) iCanTeachTheyWant++;
          break;
        }
      }
    }

    for (const want of myLearnSkills) {
      for (const canTeach of otherSkills.teach) {
        const sim = computeSkillSimilarity(want, canTeach);
        if (sim > 0) {
          totalSim += sim;
          matchCount++;
          if (want.toLowerCase() === canTeach.toLowerCase()) {
            reasons.push({ type: "exact", from: canTeach, to: want });
          } else {
            reasons.push({ type: "related", from: canTeach, to: want });
          }
          if (sim >= 0.75) theyCanTeachIWant++;
          break;
        }
      }
    }

    const potentialMatches = Math.max(otherSkills.learn.length, 1) + Math.max(myLearnSkills.length, 1);
    const matchScore = matchCount > 0 ? Math.min(Math.round((totalSim / Math.max(potentialMatches * 0.5, 1)) * 100), 100) : 0;

    const seen = new Set<string>();
    const uniqueReasons = reasons.filter((r) => {
      const key = `${r.from}-${r.to}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const userSkills = allUserSkills
      .filter((us) => us.userId.toString() === otherId)
      .map((us) => ({
        skill: { name: (us.skillId as any).name as string },
        type: us.type,
      }));

    if (matchScore > 0) {
      scored.push({
        id: otherId,
        name: other.name,
        avatar: other.avatar,
        bio: other.bio,
        location: other.location,
        rating: other.rating,
        reviewCount: other.reviewCount,
        completedSwaps: other.completedSwaps,
        trustScore: other.trustScore,
        matchScore,
        iCanTeachTheyWant,
        theyCanTeachIWant,
        reasons: uniqueReasons,
        userSkills,
      });
    }
  }

  return scored.sort((a, b) => b.matchScore - a.matchScore);
}
