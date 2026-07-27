import mongoose from "mongoose";

export interface IBadge extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserBadge extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  badgeId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface BadgeResponse {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}
