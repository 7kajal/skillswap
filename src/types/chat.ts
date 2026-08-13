import type { NamedSkill, UserSummary } from "@/types/common";

export interface ChatMessage {
  id: string;
  content: string;
  fileUrl: string | null;
  createdAt: string;
  sender: UserSummary;
}

export interface ChatSwapRequest {
  id: string;
  sender: UserSummary;
  receiver: UserSummary;
  teachSkill: NamedSkill;
  learnSkill: NamedSkill;
  status: string;
}

export interface ChatRoomInfo {
  id: string;
  swapRequest: ChatSwapRequest;
}
