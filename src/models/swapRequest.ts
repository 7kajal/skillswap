import mongoose, { Schema, Document } from "mongoose";

export interface ISwapRequest extends Document {
  _id: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  teachSkillId: mongoose.Types.ObjectId;
  learnSkillId: mongoose.Types.ObjectId;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const SwapRequestSchema = new Schema<ISwapRequest>(
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

export const SwapRequest =
  mongoose.models.SwapRequest || mongoose.model<ISwapRequest>("SwapRequest", SwapRequestSchema);
