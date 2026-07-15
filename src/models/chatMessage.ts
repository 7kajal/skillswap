import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessage extends Document {
  _id: mongoose.Types.ObjectId;
  chatRoomId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  content: string;
  fileUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    chatRoomId: { type: Schema.Types.ObjectId, ref: "ChatRoom", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    fileUrl: { type: String },
  },
  { timestamps: true }
);

ChatMessageSchema.index({ chatRoomId: 1, createdAt: 1 });

export const ChatMessage =
  mongoose.models.ChatMessage || mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);
