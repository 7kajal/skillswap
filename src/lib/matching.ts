import { prisma } from "./prisma";

export async function findMatches(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userSkills: { include: { skill: true } },
    },
  });

  if (!user) return [];

  const teachSkillIds = user.userSkills
    .filter((s) => s.type === "teach")
    .map((s) => s.skillId);
  const learnSkillIds = user.userSkills
    .filter((s) => s.type === "learn")
    .map((s) => s.skillId);

  const allUsers = await prisma.user.findMany({
    where: {
      id: { not: userId },
      isProfileComplete: true,
    },
    include: {
      userSkills: { include: { skill: true } },
    },
  });

  const scored = allUsers.map((other) => {
    const otherTeachSkills = other.userSkills
      .filter((s) => s.type === "teach")
      .map((s) => s.skillId);
    const otherLearnSkills = other.userSkills
      .filter((s) => s.type === "learn")
      .map((s) => s.skillId);

    const iCanTeachTheyWant = otherLearnSkills.filter((id) =>
      teachSkillIds.includes(id)
    ).length;
    const theyCanTeachIWant = otherTeachSkills.filter((id) =>
      learnSkillIds.includes(id)
    ).length;

    const totalSkills = new Set([...teachSkillIds, ...learnSkillIds, ...otherTeachSkills, ...otherLearnSkills]).size;
    const matchScore = totalSkills > 0
      ? Math.round(((iCanTeachTheyWant + theyCanTeachIWant) / totalSkills) * 100)
      : 0;

    return {
      ...other,
      matchScore,
      iCanTeachTheyWant,
      theyCanTeachIWant,
      password: undefined,
    };
  });

  return scored
    .filter((u) => u.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}
