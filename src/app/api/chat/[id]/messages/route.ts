import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const isMember = await prisma.userChatRoom.findUnique({
    where: { userId_chatRoomId: { userId: session.user.id, chatRoomId: id } },
  });

  if (!isMember) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const messages = await prisma.chatMessage.findMany({
    where: { chatRoomId: id },
    include: { sender: { select: { id: true, name: true, avatar: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(messages);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { content, fileUrl } = await req.json();

  const isMember = await prisma.userChatRoom.findUnique({
    where: { userId_chatRoomId: { userId: session.user.id, chatRoomId: id } },
  });

  if (!isMember) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const message = await prisma.chatMessage.create({
    data: {
      chatRoomId: id,
      senderId: session.user.id,
      content,
      fileUrl: fileUrl || null,
    },
    include: { sender: { select: { id: true, name: true, avatar: true } } },
  });

  return NextResponse.json(message);
}
