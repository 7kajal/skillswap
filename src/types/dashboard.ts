import type {
  IconComponent,
  NamedSkill,
  UserSummary,
} from "@/types/common";

export interface DashboardData {
  user: { id: string; name: string };
  stats: {
    skillsTaught: number;
    skillsLearned: number;
    completedSwaps: number;
    hoursShared: number;
    averageRating: number;
  };
  badges: {
    name: string;
    icon: string;
    description: string;
    earned: boolean;
  }[];
  recentActivity: { type: string; description: string; date: string }[];
  upcomingSessions: {
    id: string;
    title: string;
    date: string;
    startTime: string;
    otherUser: Pick<UserSummary, "name" | "avatar">;
  }[];
}

export interface DashboardSwapRequest {
  id: string;
  status: string;
  message: string | null;
  createdAt: string;
  sender: UserSummary;
  receiver: UserSummary;
  teachSkill: NamedSkill;
  learnSkill: NamedSkill;
}

export interface DashboardChatRoom {
  id: string;
  swapRequest: {
    sender: UserSummary;
    receiver: UserSummary;
    teachSkill: NamedSkill;
    learnSkill: NamedSkill;
    status: string;
  };
  messages: { content: string; createdAt: string }[];
}

export type DashboardTab = "overview" | "received" | "sent" | "chats";

export interface RequestListProps {
  requests: DashboardSwapRequest[];
  emptyTitle: string;
  emptyDescription: string;
  currentUserId: string;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  icon: IconComponent;
}
