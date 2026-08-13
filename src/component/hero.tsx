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
import type { HeroProps } from "@/types/home";
import type { HeroSkill, SkillMarqueeRowProps } from "@/types/skills";

export function Hero({ authStatus }: HeroProps) {
  const isAuthenticated = authStatus === "authenticated";

  return (
    <section className="relative overflow-hidden bg-white pb-14 pt-12 sm:pb-16 sm:pt-16 lg:min-h-[180px] lg:pb-16 lg:pt-16">
      <div className="absolute -left-48 top-5 h-[540px] w-[540px] rounded-full bg-blue-200/35 blur-[140px]" />
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
          className="mx-auto mt-7 max-w-4xl text-4xl font-black leading-20 tracking-[-0.04em] text-slate-950 sm:text-5xl md:text-6xl lg:text-[4.2rem]"
        >
          Learn anything by sharing
          <span className="block text-blue-600">what you know.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="mx-auto mt-6 max-w-xl text-base font-medium leading-7 text-slate-600"
        >
          Trade your knowledge with peers. No money, just mutual growth. Share what you excel at, learn what you're curious about.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {authStatus === "loading" ? (
              <span className="h-14 w-52 animate-pulse rounded-full bg-slate-100" aria-label="Loading account actions" />
            ) : (
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative z-10 overflow-hidden rounded-full shadow-[0_16px_35px_rgba(37,99,235,0.24)]"
              >
                <Link
                  href={isAuthenticated ? "/discover" : "/auth/register"}
                  className="animate-shimmer-sweep inline-flex h-14 items-center justify-center gap-2 bg-blue-600 px-8 text-sm font-extrabold text-white transition-colors duration-300 hover:bg-blue-700 w-full"
                >
                  {isAuthenticated ? "Find a skill match" : "Create your profile"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            )}
            <motion.a
              href="#how-it-works"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-14 items-center justify-center rounded-full border-2 border-slate-200 bg-white px-8 text-sm font-extrabold text-slate-700 shadow-sm transition-all duration-300 hover:border-blue-600 hover:text-blue-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.15)]"
            >
              See how it works
            </motion.a>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
const skills: HeroSkill[] = [
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

const secondarySkills: HeroSkill[] = [
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
}: SkillMarqueeRowProps) {
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
            <Link
              href={`/discover?search=${encodeURIComponent(skill.name)}`}
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
            </Link>
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
          <h2 className="mt-3 max-w-xl text-3xl font-black tracking-[-0.05em] text-slate-950 sm:text-4xl lg:text-5xl">
            What will you learn next?
          </h2>
          <p className="mt-3 max-w-xl text-sm font-medium leading-7 text-slate-500 sm:text-base">
            Find practical skills taught by people who are ready to learn from you too.
          </p>
        </div>
        <Link
          href="/skills"
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
