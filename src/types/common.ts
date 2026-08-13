import type { ComponentType, ReactNode, SVGProps } from "react";

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export type IconProps = SVGProps<SVGSVGElement>;

export interface NamedSkill {
  name: string;
}

export interface ProfileSkill {
  skill: NamedSkill;
  type: string;
}

export interface UserSummary {
  id: string;
  name: string;
  avatar: string | null;
}

export interface ChildrenProps {
  children: ReactNode;
}
