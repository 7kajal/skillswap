import { connectDB } from "@/lib/mongodb";
import { Review } from "@/models/review";
import { User } from "@/models/user";

export async function findReview(swapRequestId: string, reviewerId: string) {
  await connectDB();
  const review = await Review.findOne({ swapRequestId, reviewerId }).lean();
  if (!review) return null;
  return { ...review, id: review._id.toString() };
}

export async function createReview(
  swapRequestId: string,
  reviewerId: string,
  reviewedId: string,
  rating: number,
  comment?: string
) {
  await connectDB();

  const existing = await Review.findOne({ swapRequestId, reviewerId });
  if (existing) throw new Error("Already reviewed");

  const review = await Review.create({
    swapRequestId,
    reviewerId,
    reviewedId,
    rating,
    comment: comment || null,
  });

  const stats = await Review.aggregate([
    { $match: { reviewedId: review.reviewedId } },
    { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  if (stats.length > 0) {
    await User.findByIdAndUpdate(reviewedId, {
      rating: stats[0].avgRating || 0,
      reviewCount: stats[0].count,
    });
  }

  return { ...review, id: review._id.toString() };
}
