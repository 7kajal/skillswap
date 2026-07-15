import mongoose, { Schema, Document } from "mongoose";

export interface ISkill extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true, default: "General" },
  },
  { timestamps: true }
);

export const Skill = mongoose.models.Skill || mongoose.model<ISkill>("Skill", SkillSchema);
