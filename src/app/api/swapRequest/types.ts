import mongoose from "mongoose";

export interface ISwapRequest extends mongoose.Document {
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

export interface SwapRequestResponse {
  id: string;
  status: string;
  message: string | null;
  createdAt: Date;
  sender: { id: string; name: string; avatar: string | null };
  receiver: { id: string; name: string; avatar: string | null };
  teachSkill: { name: string };
  learnSkill: { name: string };
}

export interface CreateSwapRequestInput {
  receiverId: string;
  teachSkillName: string;
  learnSkillName: string;
  message?: string;
}
