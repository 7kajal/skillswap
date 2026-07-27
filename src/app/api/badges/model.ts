import mongoose from "mongoose";
import { BadgeSchema, UserBadgeSchema } from "./schema";
import type { IBadge, IUserBadge } from "./types";

export const Badge = mongoose.models.Badge || mongoose.model<IBadge>("Badge", BadgeSchema);
export const UserBadge = mongoose.models.UserBadge || mongoose.model<IUserBadge>("UserBadge", UserBadgeSchema);
