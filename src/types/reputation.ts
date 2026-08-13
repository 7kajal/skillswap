export interface ReputationData {
  rating: number;
  reviewCount: number;
  trustScore: number;
  completedSwaps: number;
  totalHoursShared: number;
  verifiedSkills: string[];
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    reviewer: { name: string; avatar: string | null };
    createdAt: string;
  }[];
  badges: { name: string; icon: string; description: string }[];
  socialLinks: {
    github: string | null;
    portfolio: string | null;
    linkedin: string | null;
  };
}
