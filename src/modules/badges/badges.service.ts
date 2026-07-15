import { connectDB } from "@/lib/mongodb";
import { Badge } from "@/models/badge";
import { UserBadge } from "@/models/userBadge";
import { User } from "@/models/user";
import { Review } from "@/models/review";
import { UserSkill } from "@/models/userSkill";
import mongoose from "mongoose";

const defaultBadges = [
  { name: "First Exchange", description: "Completed your first skill swap", icon: "🤝" },
  { name: "5-Star Reviewer", description: "Received a 5-star review", icon: "⭐" },
  { name: "Polyglot", description: "Speaks 3 or more languages", icon: "🌍" },
  { name: "Top Teacher", description: "Completed 5 or more exchanges", icon: "🎓" },
  { name: "Quick Responder", description: "Accepted a swap request within 24 hours", icon: "⚡" },
  { name: "Community Star", description: "Received 10 or more reviews", icon: "🌟" },
];

export async function getAndAwardBadges(userId: string) {
  await connectDB();

  const count = await Badge.countDocuments();
  if (count === 0) {
    await Badge.insertMany(defaultBadges);
  }

  const user = await User.findById(userId).lean();
  if (!user) return [];

  const reviews = await Review.find({ reviewedId: userId }).lean();
  const languages = user.languages || [];

  const earnedBadgeNames: string[] = [];

  if (user.completedSwaps >= 1) earnedBadgeNames.push("First Exchange");
  if (reviews.some((r) => r.rating === 5)) earnedBadgeNames.push("5-Star Reviewer");
  if (languages.length >= 3) earnedBadgeNames.push("Polyglot");
  if (user.completedSwaps >= 5) earnedBadgeNames.push("Top Teacher");
  if ((user.reviewCount || 0) >= 10) earnedBadgeNames.push("Community Star");

  for (const badgeName of earnedBadgeNames) {
    const badge = await Badge.findOne({ name: badgeName });
    if (badge) {
      await UserBadge.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId), badgeId: badge._id },
        { $setOnInsert: { userId: new mongoose.Types.ObjectId(userId), badgeId: badge._id } },
        { upsert: true }
      );
    }
  }

  const badges = await Badge.find().lean();
  const userBadges = await UserBadge.find({ userId: new mongoose.Types.ObjectId(userId) }).lean();
  const earnedBadgeIds = new Set(userBadges.map((ub) => ub.badgeId.toString()));

  return badges.map((b) => ({
    id: b._id.toString(),
    name: b.name,
    description: b.description,
    icon: b.icon,
    earned: earnedBadgeIds.has(b._id.toString()),
  }));
}
