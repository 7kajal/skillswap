import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRooms = await prisma.userChatRoom.findMany({
    where: { userId: session.user.id },
    include: {
      chatRoom: {
        include: {
          swapRequest: {
            include: {
              sender: { select: { id: true, name: true, avatar: true } },
              receiver: { select: { id: true, name: true, avatar: true } },
              teachSkill: true,
              learnSkill: true,
            },
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  return NextResponse.json(userRooms.map((ur) => ur.chatRoom));
}
