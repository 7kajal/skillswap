import { connectDB } from "@/lib/mongodb";
import { ChatRoom } from "@/models/chatRoom";
import { ChatMessage } from "@/models/chatMessage";
import mongoose from "mongoose";

export async function getUserRooms(userId: string) {
  await connectDB();
  const rooms = await ChatRoom.find({ members: new mongoose.Types.ObjectId(userId) })
    .populate({
      path: "swapRequestId",
      populate: [
        { path: "senderId", select: "name avatar" },
        { path: "receiverId", select: "name avatar" },
        { path: "teachSkillId", select: "name" },
        { path: "learnSkillId", select: "name" },
      ],
    })
    .sort({ updatedAt: -1 })
    .lean();

  const roomsWithLastMessage = await Promise.all(
    rooms.map(async (room) => {
      const lastMessage = await ChatMessage.findOne({ chatRoomId: room._id })
        .sort({ createdAt: -1 })
        .lean();

      const sr = room.swapRequestId as any;
      return {
        id: room._id.toString(),
        swapRequest: {
          sender: { id: sr.senderId?._id?.toString(), name: sr.senderId?.name, avatar: sr.senderId?.avatar },
          receiver: { id: sr.receiverId?._id?.toString(), name: sr.receiverId?.name, avatar: sr.receiverId?.avatar },
          teachSkill: { name: sr.teachSkillId?.name },
          learnSkill: { name: sr.learnSkillId?.name },
          status: sr.status,
        },
        messages: lastMessage
          ? [{ content: lastMessage.content, createdAt: lastMessage.createdAt }]
          : [],
      };
    })
  );

  return roomsWithLastMessage;
}

export async function isRoomMember(roomId: string, userId: string) {
  await connectDB();
  const room = await ChatRoom.findById(roomId).lean();
  if (!room) return false;
  return room.members.some((m: any) => m.toString() === userId);
}

export async function getMessages(roomId: string) {
  await connectDB();
  const messages = await ChatMessage.find({ chatRoomId: roomId })
    .populate("senderId", "name avatar")
    .sort({ createdAt: "asc" })
    .lean();

  return messages.map((m: any) => ({
    id: m._id.toString(),
    content: m.content,
    fileUrl: m.fileUrl,
    createdAt: m.createdAt,
    sender: {
      id: (m.senderId as any)._id?.toString() || m.senderId.toString(),
      name: (m.senderId as any).name,
      avatar: (m.senderId as any).avatar,
    },
  }));
}

export async function sendMessage(
  roomId: string,
  senderId: string,
  content: string,
  fileUrl?: string
) {
  await connectDB();
  const message = await ChatMessage.create({
    chatRoomId: roomId,
    senderId,
    content,
    fileUrl: fileUrl || null,
  });

  const populated = await ChatMessage.findById(message._id)
    .populate("senderId", "name avatar")
    .lean();

  return {
    id: populated!._id.toString(),
    content: populated!.content,
    fileUrl: populated!.fileUrl,
    createdAt: populated!.createdAt,
    sender: {
      id: (populated!.senderId as any)._id.toString(),
      name: (populated!.senderId as any).name,
      avatar: (populated!.senderId as any).avatar,
    },
  };
}
