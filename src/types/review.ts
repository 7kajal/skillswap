import type { NamedSkill } from "@/types/common";

export interface ReviewFormData {
  rating: number;
  comment: string;
}

export interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  otherUser: { name: string } | null;
  roomInfo: {
    swapRequest: {
      teachSkill: NamedSkill;
      learnSkill: NamedSkill;
    };
  };
  onSubmit: (data: ReviewFormData) => Promise<void> | void;
}
