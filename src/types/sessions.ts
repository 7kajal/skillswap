import type { NamedSkill, UserSummary } from "@/types/common";

export interface SkillSession {
  id: string;
  swapRequestId: string;
  organizer: UserSummary;
  participant: UserSummary;
  title: string;
  description: string | null;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  status: string;
  meetLink: string | null;
  notes: string | null;
  teachSkill: string;
  learnSkill: string;
}

export interface SessionSwapRequest {
  id: string;
  status: string;
  sender: Pick<UserSummary, "id" | "name">;
  receiver: Pick<UserSummary, "id" | "name">;
  teachSkill: NamedSkill;
  learnSkill: NamedSkill;
}

export interface Availability {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export type SessionsTab = "upcoming" | "past" | "availability";
