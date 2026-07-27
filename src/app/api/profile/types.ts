export interface ProfileData {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  languages: string[];
  availability: string[];
  isProfileComplete: boolean;
  rating: number;
  reviewCount: number;
  completedSwaps: number;
  trustScore: number;
  totalHoursShared: number;
  verifiedSkills: string[];
  githubUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  userSkills: { skill: { name: string }; type: string }[];
  badges: { badge: { name: string; icon: string } }[];
}

export interface ProfileByIdData extends ProfileData {
  reviewsReceived: {
    id: string;
    rating: number;
    comment: string | null;
    reviewer: { id: string; name: string; avatar: string | null };
    createdAt: Date;
  }[];
}

export interface CompleteProfileInput {
  avatar?: string;
  bio?: string;
  location?: string;
  languages?: string[];
  availability?: string[];
  teachSkills: string[];
  learnSkills: string[];
}
