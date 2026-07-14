import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { avatar, bio, location, languages, availability, teachSkills, learnSkills } = await req.json();

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        avatar: avatar || null,
        bio: bio || null,
        location: location || null,
        languages: JSON.stringify(languages || []),
        availability: JSON.stringify(availability || []),
        isProfileComplete: true,
      },
    });

    // Remove existing skills
    await prisma.userSkill.deleteMany({ where: { userId: session.user.id } });

    // Add teach skills
    for (const skillName of teachSkills) {
      const skill = await prisma.skill.upsert({
        where: { name: skillName },
        update: {},
        create: { name: skillName, category: "General" },
      });
      await prisma.userSkill.create({
        data: { userId: session.user.id, skillId: skill.id, type: "teach" },
      });
    }

    // Add learn skills
    for (const skillName of learnSkills) {
      const skill = await prisma.skill.upsert({
        where: { name: skillName },
        update: {},
        create: { name: skillName, category: "General" },
      });
      await prisma.userSkill.create({
        data: { userId: session.user.id, skillId: skill.id, type: "learn" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
