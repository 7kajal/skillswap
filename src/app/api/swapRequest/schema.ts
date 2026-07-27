import { Schema } from "mongoose";
import type { ISwapRequest } from "./types";

export const SwapRequestSchema = new Schema<ISwapRequest>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    teachSkillId: { type: Schema.Types.ObjectId, ref: "Skill", required: true },
    learnSkillId: { type: Schema.Types.ObjectId, ref: "Skill", required: true },
    message: { type: String },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

SwapRequestSchema.index({ senderId: 1, receiverId: 1, status: 1 });
