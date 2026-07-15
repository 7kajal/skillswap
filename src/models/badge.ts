import mongoose, { Schema, Document } from "mongoose";

export interface IBadge extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

const BadgeSchema = new Schema<IBadge>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
  },
  { timestamps: true }
);

export const Badge = mongoose.models.Badge || mongoose.model<IBadge>("Badge", BadgeSchema);
