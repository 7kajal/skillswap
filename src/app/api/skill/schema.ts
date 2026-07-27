import { Schema } from "mongoose";
import type { ISkill, IUserSkill } from "./types";

export const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true, default: "General" },
  },
  { timestamps: true }
);

export const UserSkillSchema = new Schema<IUserSkill>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    skillId: { type: Schema.Types.ObjectId, ref: "Skill", required: true },
    type: { type: String, enum: ["teach", "learn"], required: true },
  },
  { timestamps: true }
);

UserSkillSchema.index({ userId: 1, skillId: 1, type: 1 }, { unique: true });
