import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  swapRequestId: mongoose.Types.ObjectId;
  reviewerId: mongoose.Types.ObjectId;
  reviewedId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
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

export const Review =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
