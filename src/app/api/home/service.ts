import { User } from "@/app/api/auth/model";
import { Review } from "@/app/api/review/model";
import { SwapRequest } from "@/app/api/swapRequest/model";
import { UserSkill } from "@/app/api/skill/model";
import { connectDB } from "@/lib/mongodb";
import type { HomeData, HomeReview } from "./types";

type PopulatedReview = {
  _id: { toString(): string };
  rating: number;
  comment?: string | null;
  createdAt: Date;
  reviewerId: {
    _id: { toString(): string };
    name: string;
    avatar?: string | null;
  };
  reviewedId: {
    _id: { toString(): string };
    name: string;
  };
};

export async function getHomeData(): Promise<HomeData> {
  await connectDB();

  const [users, reviews, completedRequests, publishedReviews] =
    await Promise.all([
      User.find({ isProfileComplete: true })
        .select("name avatar bio location rating reviewCount")
        .lean(),
      Review.find({ comment: { $type: "string", $ne: "" } })
        .populate("reviewerId", "name avatar")
        .populate("reviewedId", "name")
        .sort({ createdAt: -1 })
        .limit(3)
        .lean<PopulatedReview[]>(),
      SwapRequest.find({ status: "completed" })
        .select("senderId receiverId")
        .lean(),
      Review.countDocuments({ comment: { $type: "string", $ne: "" } }),
    ]);

  const userIds = users.map((user) => user._id);
  const userSkills = await UserSkill.find({ userId: { $in: userIds } })
    .populate("skillId", "name")
    .lean();

  const skillsByUser = new Map<string, { teaches: string[]; learning: string[] }>();
  for (const userSkill of userSkills) {
    const skill = userSkill.skillId as unknown as { name?: string };
    if (!skill.name) continue;

    const userId = userSkill.userId.toString();
    const skills = skillsByUser.get(userId) || { teaches: [], learning: [] };
    skills[userSkill.type === "teach" ? "teaches" : "learning"].push(skill.name);
    skillsByUser.set(userId, skills);
  }

  const participants = new Set<string>();
  const completedSwapsByUser = new Map<string, number>();
  for (const request of completedRequests) {
    for (const participantId of [request.senderId, request.receiverId]) {
      const id = participantId.toString();
      participants.add(id);
      completedSwapsByUser.set(id, (completedSwapsByUser.get(id) || 0) + 1);
    }
  }

  return {
    members: users
      .map((user) => {
        const id = user._id.toString();
        const skills = skillsByUser.get(id) || { teaches: [], learning: [] };
        return {
          id,
          name: user.name,
          avatar: user.avatar || null,
          bio: user.bio || null,
          location: user.location || null,
          rating: user.rating || 0,
          reviewCount: user.reviewCount || 0,
          completedSwaps: completedSwapsByUser.get(id) || 0,
          ...skills,
        };
      })
      .sort(
        (a, b) =>
          b.completedSwaps - a.completedSwaps ||
          b.rating - a.rating ||
          b.reviewCount - a.reviewCount
      )
      .slice(0, 4),
    reviews: reviews
      .filter((review) => review.reviewerId && review.reviewedId && review.comment)
      .map<HomeReview>((review) => ({
        id: review._id.toString(),
        rating: review.rating,
        comment: review.comment!,
        createdAt: review.createdAt.toISOString(),
        reviewer: {
          id: review.reviewerId._id.toString(),
          name: review.reviewerId.name,
          avatar: review.reviewerId.avatar || null,
        },
        reviewed: {
          id: review.reviewedId._id.toString(),
          name: review.reviewedId.name,
        },
      })),
    stats: {
      completedSwaps: completedRequests.length,
      peopleWhoSwapped: participants.size,
      publishedReviews,
    },
  };
}
