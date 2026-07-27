import { Schema } from "mongoose";
import type { ISession, IAvailability } from "./types";

export const SessionSchema = new Schema<ISession>(
  {
    swapRequestId: { type: Schema.Types.ObjectId, ref: "SwapRequest", required: true },
    organizerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    participantId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    timezone: { type: String, default: "UTC" },
    status: {
      type: String,
      enum: ["scheduled", "in_progress", "completed", "cancelled"],
      default: "scheduled",
    },
    meetLink: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

SessionSchema.index({ organizerId: 1, date: 1 });
SessionSchema.index({ participantId: 1, date: 1 });
SessionSchema.index({ swapRequestId: 1 });

export const AvailabilitySchema = new Schema<IAvailability>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

AvailabilitySchema.index({ userId: 1, dayOfWeek: 1 });
