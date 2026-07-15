import { connectDB } from "@/lib/mongodb";
import { User, IUser } from "@/models/user";
import { UserSkill } from "@/models/userSkill";
import { Skill } from "@/models/skill";
import { Review } from "@/models/review";
import { UserBadge } from "@/models/userBadge";
import mongoose from "mongoose";

export async function getProfile(userId: string) {
  await connectDB();
  const user = await User.findById(userId)
    .select("-password")
    .lean();
  if (!user) return null;

  const userSkills = await UserSkill.find({ userId })
    .populate("skillId", "name category")
    .lean();

  const badges = await UserBadge.find({ userId })
    .populate("badgeId", "name description icon")
    .lean();

  return {
    ...user,
    id: user._id.toString(),
    userSkills: userSkills.map((us) => ({
      skill: { name: (us.skillId as any).name },
      type: us.type,
    })),
    badges: badges.map((ub) => ({
      badge: { name: (ub.badgeId as any).name, icon: (ub.badgeId as any).icon },
    })),
  };
}

export async function getProfileById(userId: string) {
  await connectDB();
  const user = await User.findById(userId).select("-password").lean();
  if (!user) return null;

  const userSkills = await UserSkill.find({ userId })
    .populate("skillId", "name category")
    .lean();

  const reviewsReceived = await Review.find({ reviewedId: userId })
    .populate("reviewerId", "name avatar")
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const badges = await UserBadge.find({ userId })
    .populate("badgeId", "name description icon")
    .lean();

  return {
    ...user,
    id: user._id.toString(),
    userSkills: userSkills.map((us) => ({
      skill: { name: (us.skillId as any).name },
      type: us.type,
    })),
    reviewsReceived: reviewsReceived.map((r) => ({
      ...r,
      id: r._id.toString(),
      reviewer: {
        id: (r.reviewerId as any)._id?.toString() || r.reviewerId.toString(),
        name: (r.reviewerId as any).name,
        avatar: (r.reviewerId as any).avatar,
      },
    })),
    badges: badges.map((ub) => ({
      badge: { name: (ub.badgeId as any).name, icon: (ub.badgeId as any).icon },
    })),
  };
}

export async function completeProfile(
  userId: string,
  data: {
    avatar?: string;
    bio?: string;
    location?: string;
    languages?: string[];
    availability?: string[];
    teachSkills: string[];
    learnSkills: string[];
  }
) {
  await connectDB();

  await User.findByIdAndUpdate(userId, {
    avatar: data.avatar || null,
    bio: data.bio || null,
    location: data.location || null,
    languages: data.languages || [],
    availability: data.availability || [],
    isProfileComplete: true,
  });

  await UserSkill.deleteMany({ userId });

  for (const skillName of data.teachSkills) {
    const skill = await Skill.findOneAndUpdate(
      { name: skillName },
      { $setOnInsert: { name: skillName, category: "General" } },
      { upsert: true, new: true }
    );
    await UserSkill.create({ userId, skillId: skill._id, type: "teach" });
  }

  for (const skillName of data.learnSkills) {
    const skill = await Skill.findOneAndUpdate(
      { name: skillName },
      { $setOnInsert: { name: skillName, category: "General" } },
      { upsert: true, new: true }
    );
    await UserSkill.create({ userId, skillId: skill._id, type: "learn" });
  }

  return { success: true };
}
