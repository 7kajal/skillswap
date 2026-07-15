import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
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

const SessionSchema = new Schema<ISession>(
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

export const Session =
  mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);
