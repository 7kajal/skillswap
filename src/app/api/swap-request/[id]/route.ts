import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await req.json();

  const swapRequest = await prisma.swapRequest.findUnique({
    where: { id },
    include: { chatRoom: true },
  });

  if (!swapRequest) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  if (status === "accepted" && swapRequest.receiverId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (status === "completed") {
    if (swapRequest.senderId !== session.user.id && swapRequest.receiverId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const updated = await prisma.swapRequest.update({
    where: { id },
    data: { status },
    include: {
      sender: { select: { id: true, name: true, avatar: true } },
      receiver: { select: { id: true, name: true, avatar: true } },
      teachSkill: true,
      learnSkill: true,
    },
  });

  // If accepted, create chat room
  if (status === "accepted" && !swapRequest.chatRoom) {
    const chatRoom = await prisma.chatRoom.create({
      data: { swapRequestId: id },
    });

    await prisma.userChatRoom.createMany({
      data: [
        { userId: swapRequest.senderId, chatRoomId: chatRoom.id },
        { userId: swapRequest.receiverId, chatRoomId: chatRoom.id },
      ],
    });
  }

  // If completed, update user stats
  if (status === "completed") {
    await prisma.user.updateMany({
      where: { id: { in: [swapRequest.senderId, swapRequest.receiverId] } },
      data: { completedSwaps: { increment: 1 } },
    });
  }

  return NextResponse.json(updated);
}
