import { connectDB } from "@/lib/mongodb";
import { SwapRequest } from "@/models/swapRequest";
import { Skill } from "@/models/skill";
import { ChatRoom } from "@/models/chatRoom";
import { User } from "@/models/user";
import { computeTrustScore } from "@/modules/reputation/reputation.service";
import mongoose from "mongoose";

export async function getSentRequests(userId: string) {
  await connectDB();
  const requests = await SwapRequest.find({ senderId: userId })
    .populate("senderId", "name avatar")
    .populate("receiverId", "name avatar")
    .populate("teachSkillId", "name")
    .populate("learnSkillId", "name")
    .sort({ createdAt: -1 })
    .lean();

  return requests.map(formatSwapRequest);
}

export async function getReceivedRequests(userId: string) {
  await connectDB();
  const requests = await SwapRequest.find({ receiverId: userId })
    .populate("senderId", "name avatar")
    .populate("receiverId", "name avatar")
    .populate("teachSkillId", "name")
    .populate("learnSkillId", "name")
    .sort({ createdAt: -1 })
    .lean();

  return requests.map(formatSwapRequest);
}

export async function createSwapRequest(
  senderId: string,
  data: { receiverId: string; teachSkillName: string; learnSkillName: string; message?: string }
) {
  await connectDB();

  if (senderId === data.receiverId) {
    throw new Error("Cannot send request to yourself");
  }

  const existing = await SwapRequest.findOne({
    $or: [
      { senderId, receiverId: data.receiverId, status: { $in: ["pending", "accepted"] } },
      { senderId: data.receiverId, receiverId: senderId, status: { $in: ["pending", "accepted"] } },
    ],
  });

  if (existing) {
    throw new Error("A request already exists with this person");
  }

  const teachSkill = await Skill.findOneAndUpdate(
    { name: data.teachSkillName },
    { $setOnInsert: { name: data.teachSkillName, category: "General" } },
    { upsert: true, new: true }
  );

  const learnSkill = await Skill.findOneAndUpdate(
    { name: data.learnSkillName },
    { $setOnInsert: { name: data.learnSkillName, category: "General" } },
    { upsert: true, new: true }
  );

  const swapRequest = await SwapRequest.create({
    senderId,
    receiverId: data.receiverId,
    teachSkillId: teachSkill._id,
    learnSkillId: learnSkill._id,
    message: data.message || null,
  });

  const populated = await SwapRequest.findById(swapRequest._id)
    .populate("senderId", "name avatar")
    .populate("receiverId", "name avatar")
    .populate("teachSkillId", "name")
    .populate("learnSkillId", "name")
    .lean();

  return formatSwapRequest(populated!);
}

export async function updateSwapRequestStatus(
  id: string,
  userId: string,
  status: string
) {
  await connectDB();

  const swapRequest = await SwapRequest.findById(id).lean();
  if (!swapRequest) throw new Error("Request not found");

  if (status === "accepted" && swapRequest.receiverId.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  if (status === "completed") {
    if (swapRequest.senderId.toString() !== userId && swapRequest.receiverId.toString() !== userId) {
      throw new Error("Unauthorized");
    }
  }

  const updated = await SwapRequest.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  )
    .populate("senderId", "name avatar")
    .populate("receiverId", "name avatar")
    .populate("teachSkillId", "name")
    .populate("learnSkillId", "name")
    .lean();

  if (status === "accepted") {
    const existingRoom = await ChatRoom.findOne({ swapRequestId: id });
    if (!existingRoom) {
      const chatRoom = await ChatRoom.create({
        swapRequestId: id,
        members: [swapRequest.senderId, swapRequest.receiverId],
      });
    }
  }

  if (status === "completed") {
    await User.updateMany(
      { _id: { $in: [swapRequest.senderId, swapRequest.receiverId] } },
      { $inc: { completedSwaps: 1 } }
    );

    const senderTrust = await computeTrustScore(swapRequest.senderId.toString());
    const receiverTrust = await computeTrustScore(swapRequest.receiverId.toString());
    await User.findByIdAndUpdate(swapRequest.senderId, { trustScore: senderTrust });
    await User.findByIdAndUpdate(swapRequest.receiverId, { trustScore: receiverTrust });
  }

  return formatSwapRequest(updated!);
}

function formatSwapRequest(r: any) {
  return {
    id: r._id?.toString() || r.id,
    status: r.status,
    message: r.message,
    createdAt: r.createdAt,
    sender: {
      id: (r.senderId as any)?._id?.toString() || r.senderId?.toString(),
      name: (r.senderId as any)?.name,
      avatar: (r.senderId as any)?.avatar,
    },
    receiver: {
      id: (r.receiverId as any)?._id?.toString() || r.receiverId?.toString(),
      name: (r.receiverId as any)?.name,
      avatar: (r.receiverId as any)?.avatar,
    },
    teachSkill: { name: (r.teachSkillId as any)?.name || "" },
    learnSkill: { name: (r.learnSkillId as any)?.name || "" },
  };
}
