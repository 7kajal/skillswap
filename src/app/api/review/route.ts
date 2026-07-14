import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const swapRequestId = searchParams.get("swapRequestId");
  const reviewerId = searchParams.get("reviewerId");

  if (!swapRequestId || !reviewerId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const review = await prisma.review.findFirst({
    where: { swapRequestId, reviewerId },
  });

  return NextResponse.json(review || {});
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { swapRequestId, reviewedId, rating, comment } = await req.json();

    const existing = await prisma.review.findFirst({
      where: { swapRequestId, reviewerId: session.user.id },
    });

    if (existing) {
      return NextResponse.json({ error: "Already reviewed" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        swapRequestId,
        reviewerId: session.user.id,
        reviewedId,
        rating,
        comment: comment || null,
      },
    });

    // Update reviewed user's rating
    const stats = await prisma.review.aggregate({
      where: { reviewedId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.user.update({
      where: { id: reviewedId },
      data: {
        rating: stats._avg.rating || 0,
        reviewCount: stats._count.rating,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
