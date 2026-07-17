const SKILL_GROUPS: string[][] = [
  ["React", "Next.js", "Vue.js", "Angular", "Svelte", "Remix"],
  ["Node.js", "Express", "Deno", "Bun", "NestJS"],
  ["TypeScript", "JavaScript", "Flow"],
  ["Python", "Django", "Flask", "FastAPI", "Ruby on Rails"],
  ["MongoDB", "PostgreSQL", "MySQL", "Database Design", "Firebase", "Redis", "Supabase"],
  ["UI Design", "Figma", "Sketch", "Adobe XD", "Canva"],
  ["HTML/CSS", "Tailwind CSS", "Sass", "CSS-in-JS"],
  ["Machine Learning", "Deep Learning", "NLP", "Computer Vision", "TensorFlow", "PyTorch"],
  ["AWS", "Docker", "Kubernetes", "Cloud Computing", "DevOps", "CI/CD"],
  ["Flutter", "React Native", "Swift", "Kotlin", "Mobile Development"],
  ["Spanish", "French", "Portuguese", "German", "Italian", "Korean", "Japanese", "Chinese", "Hindi", "Arabic"],
  ["Piano", "Guitar", "Violin", "Drums", "Singing", "Music Production"],
  ["Photography", "Video Editing", "Cinematography", "Adobe Premiere", "Final Cut Pro"],
  ["Marketing", "SEO", "Content Marketing", "Social Media Marketing", "Email Marketing", "Copywriting"],
  ["Public Speaking", "Communication", "Leadership", "Negotiation"],
  ["Cooking", "Baking", "Meal Prep"],
  ["Fitness", "Yoga", "Meditation", "Nutrition", "Personal Training"],
  ["Graphic Design", "Illustration", "Logo Design", "Brand Identity"],
  ["Project Management", "Agile", "Scrum", "Product Management"],
  ["Data Analysis", "Data Science", "Excel", "Tableau", "Power BI", "R"],
  ["Blockchain", "Web3", "Smart Contracts", "Solidity"],
  ["Cybersecurity", "Ethical Hacking", "Network Security"],
  ["3D Modeling", "Blender", "CAD", "Unity", "Unreal Engine"],
  ["English", "Academic Writing", "Creative Writing", "Technical Writing"],
  ["Video Production", "YouTube", "Podcasting", "Streaming"],
];

const groupMap = new Map<string, number>();
SKILL_GROUPS.forEach((group, idx) => {
  group.forEach((skill) => {
    groupMap.set(skill.toLowerCase(), idx);
  });
});

export function getSkillGroup(skillName: string): number | null {
  return groupMap.get(skillName.toLowerCase()) ?? null;
}

export function areSkillsRelated(a: string, b: string): boolean {
  const groupA = getSkillGroup(a);
  const groupB = getSkillGroup(b);
  if (groupA === null || groupB === null) return false;
  return groupA === groupB;
}

export function getSimilarSkills(skillName: string): string[] {
  const group = getSkillGroup(skillName);
  if (group === null) return [];
  return SKILL_GROUPS[group].filter((s) => s.toLowerCase() !== skillName.toLowerCase());
}

export function computeSkillSimilarity(a: string, b: string): number {
  if (a.toLowerCase() === b.toLowerCase()) return 1.0;
  const groupA = getSkillGroup(a);
  const groupB = getSkillGroup(b);
  if (groupA === null || groupB === null || groupA !== groupB) return 0;
  return 0.75;
}

export interface MatchReason {
  type: "exact" | "related";
  from: string;
  to: string;
}

function normalizeSkill(skillName: string): string {
  return skillName.trim().toLocaleLowerCase();
}

function findExactMatches(
  teachingSkills: string[],
  wantedSkills: string[]
): { teachingSkill: string; wantedSkill: string }[] {
  const wantedByName = new Map(
    wantedSkills.map((skill) => [normalizeSkill(skill), skill.trim()])
  );
  const seen = new Set<string>();

  return teachingSkills.flatMap((skill) => {
    const normalizedSkill = normalizeSkill(skill);
    const wantedSkill = wantedByName.get(normalizedSkill);
    if (!wantedSkill || seen.has(normalizedSkill)) return [];

    seen.add(normalizedSkill);
    return [{ teachingSkill: skill.trim(), wantedSkill }];
  });
}

export function computeMatchScore(
  myTeachSkills: string[],
  myLearnSkills: string[],
  otherTeachSkills: string[],
  otherLearnSkills: string[]
): {
  score: number;
  reasons: MatchReason[];
  iCanTeachTheyWant: number;
  theyCanTeachIWant: number;
  skillsICanTeachThem: string[];
  skillsTheyCanTeachMe: string[];
} {
  // A swap match requires both directions:
  // my teach -> their learn, AND their teach -> my learn.
  // Both directions must have at least one match.
  const iTeachMatches = findExactMatches(myTeachSkills, otherLearnSkills);
  const theyTeachMatches = findExactMatches(otherTeachSkills, myLearnSkills);

  const reasons: MatchReason[] = [
    ...iTeachMatches.map(({ teachingSkill, wantedSkill }) => ({
      type: "exact" as const,
      from: teachingSkill,
      to: wantedSkill,
    })),
    ...theyTeachMatches.map(({ teachingSkill, wantedSkill }) => ({
      type: "exact" as const,
      from: teachingSkill,
      to: wantedSkill,
    })),
  ];
  const totalWantedSkills =
    new Set(otherLearnSkills.map(normalizeSkill)).size +
    new Set(myLearnSkills.map(normalizeSkill)).size;
  const totalMatches = iTeachMatches.length + theyTeachMatches.length;
  const score = totalWantedSkills
    ? Math.round((totalMatches / totalWantedSkills) * 100)
    : 0;

  return {
    score,
    reasons,
    iCanTeachTheyWant: iTeachMatches.length,
    theyCanTeachIWant: theyTeachMatches.length,
    skillsICanTeachThem: iTeachMatches.map(({ teachingSkill }) => teachingSkill),
    skillsTheyCanTeachMe: theyTeachMatches.map(({ teachingSkill }) => teachingSkill),
  };
}
