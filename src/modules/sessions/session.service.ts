import { connectDB } from "@/lib/mongodb";
import { Session } from "@/models/session";
import { Availability } from "@/models/availability";
import { SwapRequest } from "@/models/swapRequest";
import mongoose from "mongoose";

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

function formatSession(s: any): SessionData {
  return {
    id: s._id?.toString() || s.id,
    swapRequestId: (s.swapRequestId as any)?._id?.toString() || s.swapRequestId?.toString(),
    organizer: {
      id: (s.organizerId as any)?._id?.toString() || s.organizerId?.toString(),
      name: (s.organizerId as any)?.name,
      avatar: (s.organizerId as any)?.avatar,
    },
    participant: {
      id: (s.participantId as any)?._id?.toString() || s.participantId?.toString(),
      name: (s.participantId as any)?.name,
      avatar: (s.participantId as any)?.avatar,
    },
    title: s.title,
    description: s.description || null,
    date: s.date?.toISOString?.() || s.date,
    startTime: s.startTime,
    endTime: s.endTime,
    timezone: s.timezone,
    status: s.status,
    meetLink: s.meetLink || null,
    notes: s.notes || null,
    teachSkill: (s.swapRequestId as any)?.teachSkillId?.name || "",
    learnSkill: (s.swapRequestId as any)?.learnSkillId?.name || "",
    createdAt: s.createdAt?.toISOString?.() || s.createdAt,
  };
}

export async function createSession(
  userId: string,
  data: {
    swapRequestId: string;
    title: string;
    description?: string;
    date: string;
    startTime: string;
    endTime: string;
    timezone?: string;
    meetLink?: string;
  }
): Promise<SessionData> {
  await connectDB();

  const swapRequest = await SwapRequest.findById(data.swapRequestId)
    .populate("teachSkillId", "name")
    .lean();
  if (!swapRequest) throw new Error("Swap request not found");
  if (swapRequest.status !== "accepted") throw new Error("Swap request must be accepted");

  const senderId = swapRequest.senderId.toString();
  const receiverId = swapRequest.receiverId.toString();

  if (userId !== senderId && userId !== receiverId) throw new Error("Unauthorized");

  const participantId = userId === senderId ? receiverId : senderId;

  const session = await Session.create({
    swapRequestId: data.swapRequestId,
    organizerId: userId,
    participantId,
    title: data.title,
    description: data.description || null,
    date: new Date(data.date),
    startTime: data.startTime,
    endTime: data.endTime,
    timezone: data.timezone || "UTC",
    meetLink: data.meetLink || null,
  });

  const populated = await Session.findById(session._id)
    .populate("organizerId", "name avatar")
    .populate("participantId", "name avatar")
    .populate({
      path: "swapRequestId",
      populate: { path: "teachSkillId", select: "name" },
    })
    .lean();

  return formatSession(populated!);
}

export async function getSessionsForUser(userId: string): Promise<{
  upcoming: SessionData[];
  past: SessionData[];
}> {
  await connectDB();

  const now = new Date();

  const upcomingRaw = await Session.find({
    $or: [{ organizerId: userId }, { participantId: userId }],
    date: { $gte: now },
    status: { $in: ["scheduled", "in_progress"] },
  })
    .populate("organizerId", "name avatar")
    .populate("participantId", "name avatar")
    .populate({
      path: "swapRequestId",
      populate: { path: "teachSkillId", select: "name" },
    })
    .sort({ date: 1 })
    .lean();

  const pastRaw = await Session.find({
    $and: [
      { $or: [{ organizerId: userId }, { participantId: userId }] },
      { $or: [{ date: { $lt: now } }, { status: { $in: ["completed", "cancelled"] } }] },
    ],
  })
    .populate("organizerId", "name avatar")
    .populate("participantId", "name avatar")
    .populate({
      path: "swapRequestId",
      populate: { path: "teachSkillId", select: "name" },
    })
    .sort({ date: -1 })
    .lean();

  return {
    upcoming: upcomingRaw.map(formatSession),
    past: pastRaw.map(formatSession),
  };
}

export async function updateSessionStatus(
  sessionId: string,
  userId: string,
  status: string
): Promise<SessionData> {
  await connectDB();

  const session = await Session.findById(sessionId).lean();
  if (!session) throw new Error("Session not found");

  if (session.organizerId.toString() !== userId && session.participantId.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  const updated = await Session.findByIdAndUpdate(
    sessionId,
    { status },
    { new: true }
  )
    .populate("organizerId", "name avatar")
    .populate("participantId", "name avatar")
    .populate({
      path: "swapRequestId",
      populate: { path: "teachSkillId", select: "name" },
    })
    .lean();

  return formatSession(updated!);
}

export async function updateSessionNotes(
  sessionId: string,
  userId: string,
  notes: string
): Promise<void> {
  await connectDB();

  const session = await Session.findById(sessionId).lean();
  if (!session) throw new Error("Session not found");
  if (session.organizerId.toString() !== userId && session.participantId.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  await Session.findByIdAndUpdate(sessionId, { notes });
}

export async function getUserAvailability(userId: string) {
  await connectDB();
  const slots = await Availability.find({ userId, isActive: true })
    .sort({ dayOfWeek: 1, startTime: 1 })
    .lean();

  return slots.map((s) => ({
    id: s._id.toString(),
    dayOfWeek: s.dayOfWeek,
    startTime: s.startTime,
    endTime: s.endTime,
  }));
}

export async function setUserAvailability(
  userId: string,
  slots: { dayOfWeek: number; startTime: string; endTime: string }[]
) {
  await connectDB();

  await Availability.deleteMany({ userId });

  if (slots.length > 0) {
    const docs = slots.map((s) => ({
      userId: new mongoose.Types.ObjectId(userId),
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
      isActive: true,
    }));
    await Availability.insertMany(docs);
  }

  return slots;
}
