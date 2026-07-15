import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  languages: string[];
  availability: string[];
  isProfileComplete: boolean;
  rating: number;
  reviewCount: number;
  completedSwaps: number;
  trustScore: number;
  totalHoursShared: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: Date;
  verifiedSkills: string[];
  githubUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    avatar: { type: String },
    bio: { type: String },
    location: { type: String },
    languages: { type: [String], default: [] },
    availability: { type: [String], default: [] },
    isProfileComplete: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    completedSwaps: { type: Number, default: 0 },
    trustScore: { type: Number, default: 0 },
    totalHoursShared: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    verifiedSkills: { type: [String], default: [] },
    githubUrl: { type: String },
    portfolioUrl: { type: String },
    linkedinUrl: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
