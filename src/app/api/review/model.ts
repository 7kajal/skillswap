import mongoose from "mongoose";
import { ReviewSchema } from "./schema";
import type { IReview } from "./types";

export const Review = mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
