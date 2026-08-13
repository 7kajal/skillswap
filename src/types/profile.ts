import type { ProfileSkill } from "@/types/common";

export interface Profile {
  id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  languages: string[];
  availability: string[];
  rating: number;
  reviewCount: number;
  completedSwaps: number;
  trustScore: number;
  isProfileComplete: boolean;
  userSkills: ProfileSkill[];
  reviewsReceived: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    reviewer: { name: string; avatar: string | null };
  }[];
  badges: {
    badge: { name: string; description: string; icon: string };
  }[];
}

export type OwnProfileSummary = Pick<
  Profile,
  "isProfileComplete" | "userSkills"
>;
