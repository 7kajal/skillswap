import mongoose from "mongoose";
import { UserSchema } from "./schema";
import type { IUser } from "./types";

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
