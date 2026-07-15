import mongoose, { Schema, Document } from "mongoose";

export interface IUserBadge extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  badgeId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserBadgeSchema = new Schema<IUserBadge>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    badgeId: { type: Schema.Types.ObjectId, ref: "Badge", required: true },
  },
  { timestamps: true }
);

UserBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

export const UserBadge =
  mongoose.models.UserBadge || mongoose.model<IUserBadge>("UserBadge", UserBadgeSchema);
