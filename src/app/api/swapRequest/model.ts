import mongoose from "mongoose";
import { SwapRequestSchema } from "./schema";
import type { ISwapRequest } from "./types";

export const SwapRequest = mongoose.models.SwapRequest || mongoose.model<ISwapRequest>("SwapRequest", SwapRequestSchema);
