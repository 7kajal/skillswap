import { Schema } from "mongoose";
import type { IChatRoom, IChatMessage } from "./types";

export const ChatRoomSchema = new Schema<IChatRoom>(
  {
    swapRequestId: { type: Schema.Types.ObjectId, ref: "SwapRequest", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  },
  { timestamps: true }
);

export const ChatMessageSchema = new Schema<IChatMessage>(
  {
    chatRoomId: { type: Schema.Types.ObjectId, ref: "ChatRoom", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    fileUrl: { type: String },
  },
  { timestamps: true }
);

ChatMessageSchema.index({ chatRoomId: 1, createdAt: 1 });
