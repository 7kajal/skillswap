import mongoose from "mongoose";
import { SessionSchema, AvailabilitySchema } from "./schema";
import type { ISession, IAvailability } from "./types";

export const Session = mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);
export const Availability = mongoose.models.Availability || mongoose.model<IAvailability>("Availability", AvailabilitySchema);
