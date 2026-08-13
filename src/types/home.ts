import type {
  HomeData,
  HomeMember,
  HomeReview,
} from "@/app/api/home/types";
import type { AuthStatus } from "@/types/auth";

export type { HomeData, HomeMember, HomeReview };

export interface CTAProps {
  stats: HomeData["stats"];
  loading: boolean;
  authStatus: AuthStatus;
}

export interface HeroProps {
  authStatus: AuthStatus;
}

export interface HowItWorksProps {
  authStatus?: AuthStatus;
}

export interface ExchangeShowcaseProps {
  member?: HomeMember;
  loading: boolean;
  authStatus: AuthStatus;
}

export interface CommunityProps {
  members: HomeMember[];
  loading: boolean;
}

export interface TestimonialsProps {
  reviews: HomeReview[];
  loading: boolean;
}

export interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
}
