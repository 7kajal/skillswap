import { connectDB } from "@/lib/mongodb";
import { computeMatchScore, type MatchReason } from "@/lib/skillSimilarity";
import { User } from "@/models/user";
import { UserSkill } from "@/models/userSkill";
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
  totalSkillMatches: number;
  skillsICanTeachThem: string[];
  skillsTheyCanTeachMe: string[];
  reasons: MatchReason[];
  userSkills: { skill: { name: string }; type: string }[];
}

type SkillSet = { teach: string[]; learn: string[] };

export async function findMatches(userId?: string): Promise<MatchedUser[]> {
  await connectDB();

  const hasCurrentUser = Boolean(
    userId && mongoose.Types.ObjectId.isValid(userId)
  );
  const currentUserId = hasCurrentUser
    ? new mongoose.Types.ObjectId(userId)
    : null;

  const allUsers = await User.find({
    isProfileComplete: true,
    ...(currentUserId ? { _id: { $ne: currentUserId } } : {}),
  }).lean();

  const allUserIds = allUsers.map((user) => user._id);
  const allUserSkills = await UserSkill.find({ userId: { $in: allUserIds } })
    .populate("skillId", "name")
    .lean();

  const skillsByUser = new Map<string, SkillSet>();
  for (const userSkill of allUserSkills) {
    const ownerId = userSkill.userId.toString();
    const populatedSkill = userSkill.skillId as unknown as { name?: string };
    if (!populatedSkill?.name) continue;

    const skills = skillsByUser.get(ownerId) || { teach: [], learn: [] };
    skills[userSkill.type === "teach" ? "teach" : "learn"].push(
      populatedSkill.name
    );
    skillsByUser.set(ownerId, skills);
  }

  let mySkills: SkillSet = { teach: [], learn: [] };
  if (currentUserId) {
    const currentSkills = await UserSkill.find({ userId: currentUserId })
      .populate("skillId", "name")
      .lean();

    mySkills = currentSkills.reduce<SkillSet>(
      (result, userSkill) => {
        const populatedSkill = userSkill.skillId as unknown as { name?: string };
        if (populatedSkill?.name) {
          result[userSkill.type === "teach" ? "teach" : "learn"].push(
            populatedSkill.name
          );
        }
        return result;
      },
      { teach: [], learn: [] }
    );
  }

  const profiles = allUsers.map<MatchedUser>((otherUser) => {
    const otherId = otherUser._id.toString();
    const otherSkills = skillsByUser.get(otherId) || { teach: [], learn: [] };
    const match = computeMatchScore(
      mySkills.teach,
      mySkills.learn,
      otherSkills.teach,
      otherSkills.learn
    );
    const totalSkillMatches =
      match.iCanTeachTheyWant + match.theyCanTeachIWant;

    return {
      id: otherId,
      name: otherUser.name,
      avatar: otherUser.avatar || null,
      bio: otherUser.bio || null,
      location: otherUser.location || null,
      rating: otherUser.rating,
      reviewCount: otherUser.reviewCount,
      completedSwaps: otherUser.completedSwaps,
      trustScore: otherUser.trustScore,
      matchScore: match.score,
      iCanTeachTheyWant: match.iCanTeachTheyWant,
      theyCanTeachIWant: match.theyCanTeachIWant,
      totalSkillMatches,
      skillsICanTeachThem: match.skillsICanTeachThem,
      skillsTheyCanTeachMe: match.skillsTheyCanTeachMe,
      reasons: match.reasons,
      userSkills: [
        ...otherSkills.teach.map((name) => ({
          skill: { name },
          type: "teach",
        })),
        ...otherSkills.learn.map((name) => ({
          skill: { name },
          type: "learn",
        })),
      ],
    };
  });

  return profiles
    .filter((p) => p.iCanTeachTheyWant > 0 && p.theyCanTeachIWant > 0)
    .sort(
    (a, b) =>
      b.totalSkillMatches - a.totalSkillMatches ||
      b.matchScore - a.matchScore ||
      b.rating - a.rating ||
      b.completedSwaps - a.completedSwaps
  );
}
