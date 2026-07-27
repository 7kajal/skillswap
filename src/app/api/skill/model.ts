import mongoose from "mongoose";
import { SkillSchema, UserSkillSchema } from "./schema";
import type { ISkill, IUserSkill } from "./types";

export const Skill = mongoose.models.Skill || mongoose.model<ISkill>("Skill", SkillSchema);
export const UserSkill = mongoose.models.UserSkill || mongoose.model<IUserSkill>("UserSkill", UserSkillSchema);
