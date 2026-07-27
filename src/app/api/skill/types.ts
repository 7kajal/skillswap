import mongoose from "mongoose";

export interface ISkill extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserSkill extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  skillId: mongoose.Types.ObjectId;
  type: "teach" | "learn";
  createdAt: Date;
  updatedAt: Date;
}

export interface SkillResponse {
  id: string;
  name: string;
  category: string;
}

export type SkillType = "teach" | "learn";
