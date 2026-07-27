import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
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

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
}
