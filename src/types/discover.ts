import type { ProfileSkill } from "@/types/common";

export interface MatchReason {
  type: "exact" | "related";
  from: string;
  to: string;
}

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
  userSkills: ProfileSkill[];
  swapCount?: number;
}

export interface OwnProfile {
  isProfileComplete: boolean;
  userSkills: ProfileSkill[];
}

export interface RequestDialogProps {
  ownProfile: OwnProfile | null;
  swapUser: MatchedUser | null;
  onClose: () => void;
  onSuccess: (userId: string) => void;
}
