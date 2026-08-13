import type { IconComponent } from "@/types/common";

export type SkillCategory =
  | "tech"
  | "lang"
  | "creative"
  | "business"
  | "lifestyle";

export interface SkillItem {
  name: string;
  category: SkillCategory;
  description: string;
  color: string;
  icon: IconComponent;
}

export interface HeroSkill {
  name: string;
  icon: IconComponent;
  iconClassName: string;
}

export interface SkillMarqueeRowProps {
  items: HeroSkill[];
  reverse?: boolean;
}
