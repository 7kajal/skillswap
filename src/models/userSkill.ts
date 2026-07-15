import mongoose, { Schema, Document } from "mongoose";

export interface IUserSkill extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  skillId: mongoose.Types.ObjectId;
  type: "teach" | "learn";
  createdAt: Date;
  updatedAt: Date;
}

const UserSkillSchema = new Schema<IUserSkill>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    skillId: { type: Schema.Types.ObjectId, ref: "Skill", required: true },
    type: { type: String, enum: ["teach", "learn"], required: true },
  },
  { timestamps: true }
);

UserSkillSchema.index({ userId: 1, skillId: 1, type: 1 }, { unique: true });

export const UserSkill =
  mongoose.models.UserSkill || mongoose.model<IUserSkill>("UserSkill", UserSkillSchema);
