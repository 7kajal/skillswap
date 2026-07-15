import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/user";
import { Review } from "@/models/review";
import { SwapRequest } from "@/models/swapRequest";
import { UserSkill } from "@/models/userSkill";
import { UserBadge } from "@/models/userBadge";
import { Badge } from "@/models/badge";
import { Session } from "@/models/session";

export interface ReputationData {
  rating: number;
  reviewCount: number;
  trustScore: number;
  completedSwaps: number;
  totalHoursShared: number;
  verifiedSkills: string[];
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    reviewer: { name: string; avatar: string | null };
    createdAt: string;
  }[];
  badges: { name: string; icon: string; description: string }[];
  socialLinks: {
    github: string | null;
    portfolio: string | null;
    linkedin: string | null;
  };
}

export async function getReputation(userId: string): Promise<ReputationData> {
  await connectDB();

  const user = await User.findById(userId).lean();
  if (!user) throw new Error("User not found");

  const reviews = await Review.find({ reviewedId: userId })
    .populate("reviewerId", "name avatar")
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  const userBadges = await UserBadge.find({ userId })
    .populate("badgeId", "name icon description")
    .lean();

  return {
    rating: user.rating,
    reviewCount: user.reviewCount,
    trustScore: user.trustScore,
    completedSwaps: user.completedSwaps,
    totalHoursShared: user.totalHoursShared,
    verifiedSkills: user.verifiedSkills || [],
    reviews: reviews.map((r) => ({
      id: r._id.toString(),
      rating: r.rating,
      comment: r.comment || null,
      reviewer: {
        name: (r.reviewerId as any)?.name || "Anonymous",
        avatar: (r.reviewerId as any)?.avatar || null,
      },
      createdAt: r.createdAt?.toISOString?.() || "",
    })),
    badges: userBadges.map((ub) => ({
      name: (ub.badgeId as any)?.name || "",
      icon: (ub.badgeId as any)?.icon || "",
      description: (ub.badgeId as any)?.description || "",
    })),
    socialLinks: {
      github: user.githubUrl || null,
      portfolio: user.portfolioUrl || null,
      linkedin: user.linkedinUrl || null,
    },
  };
}

export async function updateSocialLinks(
  userId: string,
  links: { githubUrl?: string; portfolioUrl?: string; linkedinUrl?: string }
) {
  await connectDB();
  const update: any = {};
  if (links.githubUrl !== undefined) update.githubUrl = links.githubUrl;
  if (links.portfolioUrl !== undefined) update.portfolioUrl = links.portfolioUrl;
  if (links.linkedinUrl !== undefined) update.linkedinUrl = links.linkedinUrl;
  await User.findByIdAndUpdate(userId, update);
}

export async function verifySkill(userId: string, skillName: string) {
  await connectDB();
  await User.findByIdAndUpdate(userId, {
    $addToSet: { verifiedSkills: skillName },
  });
  const user = await User.findById(userId).lean();
  return user?.verifiedSkills || [];
}

export async function computeTrustScore(userId: string): Promise<number> {
  await connectDB();

  const user = await User.findById(userId).lean();
  if (!user) return 0;

  let score = 0;

  if (user.completedSwaps >= 1) score += 15;
  if (user.completedSwaps >= 5) score += 15;
  if (user.completedSwaps >= 10) score += 10;

  if (user.rating >= 4.0) score += 15;
  if (user.rating >= 4.5) score += 10;
  if (user.reviewCount >= 5) score += 10;
  if (user.reviewCount >= 10) score += 5;

  if (user.githubUrl) score += 5;
  if (user.portfolioUrl) score += 5;
  if (user.verifiedSkills && user.verifiedSkills.length > 0) score += 5;
  if (user.avatar) score += 3;
  if (user.bio && user.bio.length > 20) score += 2;

  return Math.min(score, 100);
}
