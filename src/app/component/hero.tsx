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
  Search,
  Utensils,
  WandSparkles,
  X,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { Header } from "./header";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pb-20 pt-32 sm:pt-36 lg:min-h-[760px]">
      <Header />

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
          Search for a skill, discover the right person and exchange knowledge
          without exchanging money.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <HeroSearch />
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
function HeroSearch() {
  const [query, setQuery] = useState("");

  const suggestions = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) return [];

    return [...skills, ...secondarySkills]
      .filter((skill) => skill.name.toLowerCase().includes(value))
      .slice(0, 5);
  }, [query]);

  return (
    <div className="relative mx-auto mt-10 max-w-2xl">
      <div className="absolute -inset-3 rounded-[30px] bg-blue-600/10 blur-2xl" />

      <div className="relative rounded-[26px] border border-slate-200 bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="What skill do you want to learn?"
              className="h-15 w-full rounded-2xl bg-white pl-12 pr-11 text-sm font-semibold text-slate-950 outline-none placeholder:font-medium placeholder:text-slate-400"
            />

            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          <button className="inline-flex h-15 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
            Find a match
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {suggestions.length > 0 ? (
          <div className="mt-2 border-t border-slate-100 p-2">
            {suggestions.map((suggestion) => {
              const Icon = suggestion.icon;

              return (
                <button
                  type="button"
                  key={suggestion.name}
                  onClick={() => setQuery(suggestion.name)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition hover:bg-blue-50"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${suggestion.iconClassName}`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>

                    <span className="text-sm font-bold text-slate-800">
                      {suggestion.name}
                    </span>
                  </span>

                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

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
      id="explore"
      className="overflow-hidden border-y border-slate-200 bg-slate-50 py-16 sm:py-20"
    >
      <div className="mt-10 space-y-4">
        <SkillMarqueeRow items={skills} />
        <SkillMarqueeRow items={secondarySkills} reverse />
      </div>
    </section>
  );
}
