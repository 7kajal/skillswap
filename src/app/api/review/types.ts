import mongoose from "mongoose";

export interface IReview extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  swapRequestId: mongoose.Types.ObjectId;
  reviewerId: mongoose.Types.ObjectId;
  reviewedId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewResponse {
  id: string;
  swapRequestId: string;
  reviewerId: string;
  reviewedId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
}
