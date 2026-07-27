import mongoose from "mongoose";

export interface IChatRoom extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  swapRequestId: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatMessage extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  chatRoomId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  content: string;
  fileUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatRoomResponse {
  id: string;
  swapRequest: {
    id: string;
    sender: { id: string; name: string; avatar: string | null };
    receiver: { id: string; name: string; avatar: string | null };
    teachSkill: { name: string };
    learnSkill: { name: string };
    status: string;
  };
  messages: { content: string; createdAt: Date }[];
}

export interface ChatMessageResponse {
  id: string;
  content: string;
  fileUrl: string | null;
  createdAt: Date;
  sender: {
    id: string;
    name: string;
    avatar: string | null;
  };
}
