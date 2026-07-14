import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const defaultBadges = [
  { name: "First Exchange", description: "Completed your first skill swap", icon: "🤝" },
  { name: "5-Star Reviewer", description: "Received a 5-star review", icon: "⭐" },
  { name: "Polyglot", description: "Speaks 3 or more languages", icon: "🌍" },
  { name: "Top Teacher", description: "Completed 5 or more exchanges", icon: "🎓" },
  { name: "Quick Responder", description: "Accepted a swap request within 24 hours", icon: "⚡" },
  { name: "Community Star", description: "Received 10 or more reviews", icon: "🌟" },
];

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Seed badges if none exist
  const count = await prisma.badge.count();
  if (count === 0) {
    await prisma.badge.createMany({ data: defaultBadges });
  }

  // Check and award badges
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { userSkills: true, reviewsReceived: true, badges: true },
  });

  if (user) {
    const earnedBadgeNames: string[] = [];
    const languages = JSON.parse(user.languages);

    if (user.completedSwaps >= 1) earnedBadgeNames.push("First Exchange");
    if (user.reviewsReceived.some((r) => r.rating === 5)) earnedBadgeNames.push("5-Star Reviewer");
    if (languages.length >= 3) earnedBadgeNames.push("Polyglot");
    if (user.completedSwaps >= 5) earnedBadgeNames.push("Top Teacher");
    if (user.reviewCount >= 10) earnedBadgeNames.push("Community Star");

    for (const badgeName of earnedBadgeNames) {
      const badge = await prisma.badge.findUnique({ where: { name: badgeName } });
      if (badge) {
        await prisma.userBadge.upsert({
          where: { userId_badgeId: { userId: user.id, badgeId: badge.id } },
          update: {},
          create: { userId: user.id, badgeId: badge.id },
        });
      }
    }
  }

  const badges = await prisma.badge.findMany({
    include: { users: { where: { userId: session.user.id } } },
  });

  return NextResponse.json(badges);
}
