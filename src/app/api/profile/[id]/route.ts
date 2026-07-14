import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      userSkills: { include: { skill: true } },
      reviewsReceived: {
        include: { reviewer: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      badges: { include: { badge: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...user,
    password: undefined,
    languages: JSON.parse(user.languages),
    availability: JSON.parse(user.availability),
  });
}
