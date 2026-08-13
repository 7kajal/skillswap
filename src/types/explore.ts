import type { ReactNode } from "react";
import type { IconComponent } from "@/types/common";

export interface Category {
  id: string;
  name: string;
  icon: IconComponent;
  skills: number;
  members: number;
  iconClassName: string;
}

export interface Teacher {
  id: string;
  name: string;
  avatar: string;
  location: string;
  role: string;
  rating: number;
  reviews: number;
  match: number;
  online: boolean;
  teach: string[];
  learn: string[];
}

export interface TrendingSkill {
  id: string;
  name: string;
  teachers: number;
}

export interface ExploreSectionHeaderProps {
  badge?: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export interface SearchAreaProps {
  value: string;
  onChange: (value: string) => void;
}

export interface CategoryCardProps {
  category: Category;
  active: boolean;
  onClick: () => void;
  index: number;
}

export interface MentorCardProps {
  teacher: Teacher;
  index: number;
}
