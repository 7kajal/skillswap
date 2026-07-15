import mongoose, { Schema, Document } from "mongoose";

export interface IChatRoom extends Document {
  _id: mongoose.Types.ObjectId;
  swapRequestId: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatRoomSchema = new Schema<IChatRoom>(
  {
    swapRequestId: { type: Schema.Types.ObjectId, ref: "SwapRequest", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  },
  { timestamps: true }
);

export const ChatRoom =
  mongoose.models.ChatRoom || mongoose.model<IChatRoom>("ChatRoom", ChatRoomSchema);
