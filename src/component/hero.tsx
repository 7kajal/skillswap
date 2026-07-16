"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  Camera,
  ChevronRight,
  Code2,
  Compass,
  Dumbbell,
  Languages,
  MessageCircle,
  Music2,
  Palette,
  Utensils,
  WandSparkles,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pb-20 pt-16 sm:pt-20 lg:min-h-[710px] lg:pt-24">
      <div className="absolute -left-48 top-8 h-[540px] w-[540px] rounded-full bg-blue-200/35 blur-[140px]" />
      <div className="absolute -right-48 top-0 h-[560px] w-[560px] rounded-full bg-indigo-200/35 blur-[150px]" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.04)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />

      <div className="relative mx-auto max-w-7xl px-5 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-blue-600"
        >
          <Compass className="h-4 w-4" />
          The skill exchange network
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mx-auto mt-7 max-w-5xl text-[3.25rem] font-black leading-[0.98] tracking-[-0.07em] text-slate-950 sm:text-6xl lg:text-[5.3rem]"
        >
          Learn anything by sharing
          <span className="block text-blue-600">what you already know.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="mx-auto mt-7 max-w-2xl text-base font-medium leading-8 text-slate-600 sm:text-lg"
        >
          Meet people who want to learn what you know—and can teach you what
          you want to learn.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/auth/register"
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-blue-600 px-8 text-sm font-extrabold text-white shadow-[0_16px_35px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Join now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex h-14 items-center justify-center rounded-full border border-slate-200 bg-white px-8 text-sm font-extrabold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
            >
              See how it works
            </a>
          </div>
          <p className="mt-5 text-xs font-bold text-slate-400">
            Free to join · No subscriptions · Real people
          </p>
        </motion.div>
      </div>
    </section>
  );
}
type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type Skill = {
  name: string;
  icon: IconType;
  iconClassName: string;
};

const skills: Skill[] = [
  {
    name: "React",
    icon: Code2,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    name: "UI Design",
    icon: Palette,
    iconClassName: "bg-violet-50 text-violet-600",
  },
  {
    name: "Photography",
    icon: Camera,
    iconClassName: "bg-rose-50 text-rose-600",
  },
  {
    name: "Spanish",
    icon: Languages,
    iconClassName: "bg-emerald-50 text-emerald-600",
  },
  {
    name: "Piano",
    icon: Music2,
    iconClassName: "bg-pink-50 text-pink-600",
  },
  {
    name: "Marketing",
    icon: BriefcaseBusiness,
    iconClassName: "bg-amber-50 text-amber-600",
  },
  {
    name: "Fitness",
    icon: Dumbbell,
    iconClassName: "bg-cyan-50 text-cyan-600",
  },
  {
    name: "Cooking",
    icon: Utensils,
    iconClassName: "bg-lime-50 text-lime-700",
  },
];

const secondarySkills: Skill[] = [
  {
    name: "Next.js",
    icon: Code2,
    iconClassName: "bg-slate-100 text-slate-900",
  },
  {
    name: "Brand Strategy",
    icon: WandSparkles,
    iconClassName: "bg-indigo-50 text-indigo-600",
  },
  {
    name: "English",
    icon: Languages,
    iconClassName: "bg-sky-50 text-sky-600",
  },
  {
    name: "Public Speaking",
    icon: MessageCircle,
    iconClassName: "bg-orange-50 text-orange-600",
  },
  {
    name: "Video Editing",
    icon: Camera,
    iconClassName: "bg-fuchsia-50 text-fuchsia-600",
  },
  {
    name: "Business",
    icon: BriefcaseBusiness,
    iconClassName: "bg-yellow-50 text-yellow-700",
  },
  {
    name: "Strength Training",
    icon: Dumbbell,
    iconClassName: "bg-teal-50 text-teal-600",
  },
  {
    name: "Baking",
    icon: Utensils,
    iconClassName: "bg-red-50 text-red-600",
  },
];
function SkillMarqueeRow({
  items,
  reverse = false,
}: {
  items: Skill[];
  reverse?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const repeatedItems = [...items, ...items, ...items];

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex w-max gap-4"
        animate={
          reduceMotion
            ? undefined
            : {
                x: reverse ? ["-33.333%", "0%"] : ["0%", "-33.333%"],
              }
        }
        transition={{
          duration: 30,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {repeatedItems.map((skill, index) => {
          const Icon = skill.icon;

          return (
            <button
              type="button"
              key={`${skill.name}-${index}`}
              className="group flex min-w-[190px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm transition hover:border-blue-200 hover:shadow-lg"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${skill.iconClassName}`}
              >
                <Icon className="h-5 w-5" />
              </span>

              <span className="text-sm font-extrabold text-slate-800 group-hover:text-blue-600">
                {skill.name}
              </span>

              <ChevronRight className="ml-auto h-4 w-4 text-slate-300 group-hover:text-blue-600" />
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}

export function SkillsMarquee() {
  return (
    <section
      id="skills"
      className="overflow-hidden border-y border-slate-200 bg-slate-50 py-20 sm:py-24"
    >
      <div className="mx-auto mb-10 flex max-w-7xl flex-col justify-between gap-5 px-5 sm:px-6 md:flex-row md:items-end lg:px-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
            Explore skills
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-black tracking-[-0.05em] text-slate-950 sm:text-4xl">
            What will you learn next?
          </h2>
          <p className="mt-3 max-w-xl text-sm font-medium leading-7 text-slate-500 sm:text-base">
            Find practical skills taught by people who are ready to learn from you too.
          </p>
        </div>
        <Link
          href="/discover"
          className="group inline-flex w-fit items-center gap-2 text-sm font-black text-blue-600"
        >
          Explore all skills
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="relative space-y-4 before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-16 before:bg-linear-to-r before:from-slate-50 before:to-transparent after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-16 after:bg-linear-to-l after:from-slate-50 after:to-transparent sm:before:w-32 sm:after:w-32">
        <SkillMarqueeRow items={skills} />
        <SkillMarqueeRow items={secondarySkills} reverse />
      </div>
    </section>
  );
}
