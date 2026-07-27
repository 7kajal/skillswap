import type { MatchReason } from "@/lib/skillSimilarity";

export interface MatchedUser {
  id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  rating: number;
  reviewCount: number;
  completedSwaps: number;
  trustScore: number;
  matchScore: number;
  iCanTeachTheyWant: number;
  theyCanTeachIWant: number;
  totalSkillMatches: number;
  skillsICanTeachThem: string[];
  skillsTheyCanTeachMe: string[];
  reasons: MatchReason[];
  userSkills: { skill: { name: string }; type: string }[];
}

export type SkillSet = { teach: string[]; learn: string[] };
