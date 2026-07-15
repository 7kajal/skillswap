import mongoose, { Schema, Document } from "mongoose";

export interface IAvailability extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AvailabilitySchema = new Schema<IAvailability>(
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

export const Availability =
  mongoose.models.Availability || mongoose.model<IAvailability>("Availability", AvailabilitySchema);
