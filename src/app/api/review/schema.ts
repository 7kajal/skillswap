import { Schema } from "mongoose";
import type { IReview } from "./types";

export const ReviewSchema = new Schema<IReview>(
  {
    swapRequestId: { type: Schema.Types.ObjectId, ref: "SwapRequest", required: true },
    reviewerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviewedId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

ReviewSchema.index({ swapRequestId: 1, reviewerId: 1 }, { unique: true });
