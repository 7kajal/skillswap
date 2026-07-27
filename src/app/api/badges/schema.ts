import { Schema } from "mongoose";
import type { IBadge, IUserBadge } from "./types";

export const BadgeSchema = new Schema<IBadge>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserBadgeSchema = new Schema<IUserBadge>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    badgeId: { type: Schema.Types.ObjectId, ref: "Badge", required: true },
  },
  { timestamps: true }
);

UserBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });
