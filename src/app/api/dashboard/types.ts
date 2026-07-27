export interface DashboardStats {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    bio: string | null;
    location: string | null;
    rating: number;
    reviewCount: number;
    completedSwaps: number;
    trustScore: number;
    totalHoursShared: number;
    currentStreak: number;
    longestStreak: number;
    verifiedSkills: string[];
  };
  stats: {
    skillsTaught: number;
    skillsLearned: number;
    completedSwaps: number;
    hoursShared: number;
    averageRating: number;
    currentStreak: number;
  };
  badges: { name: string; icon: string; description: string; earned: boolean }[];
  recentActivity: {
    type: string;
    description: string;
    date: string;
  }[];
  upcomingSessions: {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    otherUser: { name: string; avatar: string | null };
  }[];
  achievements: {
    id: string;
    name: string;
    icon: string;
    description: string;
    unlocked: boolean;
    progress: number;
    target: number;
  }[];
}
