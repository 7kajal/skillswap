import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [sent, received] = await Promise.all([
    prisma.swapRequest.findMany({
      where: { senderId: session.user.id },
      include: {
        receiver: { select: { id: true, name: true, avatar: true } },
        teachSkill: true,
        learnSkill: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.swapRequest.findMany({
      where: { receiverId: session.user.id },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        teachSkill: true,
        learnSkill: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({ sent, received });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { receiverId, teachSkillName, learnSkillName, message } = await req.json();

    if (session.user.id === receiverId) {
      return NextResponse.json({ error: "Cannot send request to yourself" }, { status: 400 });
    }

    const existing = await prisma.swapRequest.findFirst({
      where: {
        OR: [
          { senderId: session.user.id, receiverId, status: { in: ["pending", "accepted"] } },
          { senderId: receiverId, receiverId: session.user.id, status: { in: ["pending", "accepted"] } },
        ],
      },
    });

    if (existing) {
      return NextResponse.json({ error: "A request already exists with this person" }, { status: 409 });
    }

    const teachSkill = await prisma.skill.upsert({
      where: { name: teachSkillName },
      update: {},
      create: { name: teachSkillName, category: "General" },
    });

    const learnSkill = await prisma.skill.upsert({
      where: { name: learnSkillName },
      update: {},
      create: { name: learnSkillName, category: "General" },
    });

    const swapRequest = await prisma.swapRequest.create({
      data: {
        senderId: session.user.id,
        receiverId,
        teachSkillId: teachSkill.id,
        learnSkillId: learnSkill.id,
        message: message || null,
      },
      include: {
        receiver: { select: { id: true, name: true, avatar: true } },
        teachSkill: true,
        learnSkill: true,
      },
    });

    return NextResponse.json(swapRequest);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
