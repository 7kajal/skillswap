import { Schema } from "mongoose";
import type { IUser } from "./types";

export const UserSchema = new Schema<IUser>(
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
