import mongoose from "mongoose";

export interface ISession extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  swapRequestId: mongoose.Types.ObjectId;
  organizerId: mongoose.Types.ObjectId;
  participantId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  timezone: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  meetLink?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAvailability extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionData {
  id: string;
  swapRequestId: string;
  organizer: { id: string; name: string; avatar: string | null };
  participant: { id: string; name: string; avatar: string | null };
  title: string;
  description: string | null;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  status: string;
  meetLink: string | null;
  notes: string | null;
  teachSkill: string;
  learnSkill: string;
  createdAt: string;
}

export interface CreateSessionInput {
  swapRequestId: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone?: string;
  meetLink?: string;
}

export interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}
