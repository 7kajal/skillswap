"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Code2,
  Palette,
  Languages,
  Music2,
  BriefcaseBusiness,
  Dumbbell,
  Utensils,
  Camera,
  Search,
  Sparkles,
  BookOpen,
  Heart,
  Compass,
} from "lucide-react";
import type { SkillItem } from "@/types/skills";

const CATEGORIES = [
  { id: "all", name: "All Skills" },
  { id: "tech", name: "Tech & Design" },
  { id: "lang", name: "Languages" },
  { id: "creative", name: "Creative Arts" },
  { id: "business", name: "Business & Marketing" },
  { id: "lifestyle", name: "Health & Lifestyle" },
];

const SKILLS_LIST: SkillItem[] = [
  {
    name: "React",
    category: "tech",
    description: "Build interactive web interfaces with modern components.",
    color:
      "from-blue-500 to-cyan-500 bg-blue-50/50 text-blue-600 border-blue-100",
    icon: Code2,
  },
  {
    name: "Next.js",
    category: "tech",
    description:
      "Server-side rendering, routing, and full-stack React architectures.",
    color:
      "from-slate-700 to-slate-900 bg-slate-50 text-slate-800 border-slate-200",
    icon: Code2,
  },
  {
    name: "UI Design",
    category: "tech",
    description:
      "Design user-centered interfaces with Figma, layout, & typography.",
    color:
      "from-violet-500 to-fuchsia-500 bg-violet-50 text-violet-600 border-violet-100",
    icon: Palette,
  },
  {
    name: "Photography",
    category: "creative",
    description: "Composition, lighting, and advanced digital camera settings.",
    color: "from-rose-500 to-pink-500 bg-rose-50 text-rose-600 border-rose-100",
    icon: Camera,
  },
  {
    name: "Spanish",
    category: "lang",
    description:
      "Conversational Spanish, dialects, and grammatical structures.",
    color:
      "from-emerald-500 to-teal-500 bg-emerald-50 text-emerald-600 border-emerald-100",
    icon: Languages,
  },
  {
    name: "Piano",
    category: "creative",
    description: "Basic chords, music theory, and learning to read sheets.",
    color: "from-pink-500 to-rose-400 bg-pink-50 text-pink-600 border-pink-100",
    icon: Music2,
  },
  {
    name: "Marketing",
    category: "business",
    description:
      "Growth hacking, social media ads, and brand message positioning.",
    color:
      "from-amber-500 to-orange-500 bg-amber-50 text-amber-600 border-amber-100",
    icon: BriefcaseBusiness,
  },
  {
    name: "Fitness",
    category: "lifestyle",
    description:
      "Full body workout planning, HIIT coaching, and endurance design.",
    color: "from-cyan-500 to-blue-500 bg-cyan-50 text-cyan-600 border-cyan-100",
    icon: Dumbbell,
  },
  {
    name: "Cooking",
    category: "creative",
    description:
      "Master essential culinary techniques, knife skills, and plating.",
    color:
      "from-lime-500 to-emerald-500 bg-lime-50 text-lime-700 border-lime-100",
    icon: Utensils,
  },
  {
    name: "Brand Strategy",
    category: "business",
    description:
      "Create brand identities, style guides, and strategic vision files.",
    color:
      "from-indigo-500 to-purple-500 bg-indigo-50 text-indigo-600 border-indigo-100",
    icon: Palette,
  },
  {
    name: "English",
    category: "lang",
    description:
      "Accent neutralization, formal business english, and public speaking.",
    color: "from-sky-500 to-blue-500 bg-sky-50 text-sky-600 border-sky-100",
    icon: Languages,
  },
  {
    name: "Public Speaking",
    category: "business",
    description:
      "Presentation storytelling, vocal coaching, and anxiety control.",
    color:
      "from-orange-500 to-red-500 bg-orange-50 text-orange-600 border-orange-100",
    icon: BookOpen,
  },
  {
    name: "Video Editing",
    category: "creative",
    description:
      "Transitions, color grading, sound design in Premiere/DaVinci.",
    color:
      "from-fuchsia-500 to-pink-500 bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100",
    icon: Camera,
  },
  {
    name: "Business Strategy",
    category: "business",
    description:
      "Starting a SaaS business, fundraising, and pitch decks formulation.",
    color:
      "from-yellow-500 to-amber-600 bg-yellow-50 text-yellow-700 border-yellow-150",
    icon: BriefcaseBusiness,
  },
  {
    name: "Strength Training",
    category: "lifestyle",
    description:
      "Hypertrophy guidelines, barbell forms, and powerlifting coaching.",
    color:
      "from-teal-500 to-emerald-500 bg-teal-50 text-teal-600 border-teal-100",
    icon: Dumbbell,
  },
  {
    name: "Baking",
    category: "creative",
    description:
      "Sourdough starters, patisserie skills, and french bread baking.",
    color: "from-red-500 to-rose-500 bg-red-50 text-red-600 border-red-100",
    icon: Utensils,
  },
];

export default function SkillsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredSkills = useMemo(() => {
    let result = SKILLS_LIST;

    if (selectedCategory !== "all") {
      result = result.filter((skill) => skill.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (skill) =>
          skill.name.toLowerCase().includes(q) ||
          skill.description.toLowerCase().includes(q),
      );
    }

    return result;
  }, [selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20 pt-10">
      {/* Background Gradients */}
      <div className="absolute -left-48 top-8 h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-[130px] pointer-events-none" />
      <div className="absolute -right-48 top-0 h-[500px] w-[500px] rounded-full bg-indigo-100/40 blur-[130px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Navigation */}

        {/* Heading */}
        <div className="mt-8 flex flex-col ">
          <div className="inline-flex items-center gap-2  text-[11px] font-extrabold tracking-[0.16em] uppercase text-blue-600 mb-4 animate-fade-in">
            SKILL INDEX
          </div>
          <h1 className="text-3xl font-black tracking-[-0.055em] text-slate-950 sm:text-4xl lg:text-5xl">
            Explore skills & knowledge.
          </h1>
          <p className="mt-3 max-w-xl text-base font-semibold leading-7 text-slate-500">
            Browse categories, find what you want to learn next, and meet real
            people who can swap with you.
          </p>
          {/* <div className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-400">
            <Sparkles className="h-4 w-4 text-blue-500" />
            {SKILLS_LIST.length} skills available to trade
          </div> */}
        </div>

        {/* Search */}
        <div className="relative mt-8">
          <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search for React, photography, Spanish, cooking..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-5 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:h-16 shadow-xs"
          />
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`h-11 px-6 rounded-full text-xs font-black transition-all flex items-center justify-center ${
                selectedCategory === cat.id
                  ? "bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.2)]"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid List */}
        {filteredSkills.length === 0 ? (
          <div className="mt-12 text-center py-20 rounded-[32px] border border-dashed border-slate-200 bg-white shadow-xs">
            <Search className="h-10 w-10 text-slate-350 mx-auto" />
            <h3 className="mt-4 text-lg font-black text-slate-950">
              No skills found
            </h3>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Try adjusting your search terms or filter selection.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSkills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <motion.article
                  key={skill.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-200 hover:shadow-[0_20px_45px_rgba(37,99,235,0.08)] transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border ${skill.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="rounded-full bg-slate-50 border border-slate-100 px-2.5 py-1 text-[9px] font-black uppercase text-slate-400">
                        {skill.category}
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-black text-slate-950 group-hover:text-blue-600 transition-colors">
                      {skill.name}
                    </h3>
                    <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
                      {skill.description}
                    </p>
                  </div>

                  <Link
                    href={`/discover?search=${encodeURIComponent(skill.name)}`}
                    className="mt-6 flex items-center justify-between text-xs font-black text-blue-600 hover:text-blue-700 pt-4 border-t border-slate-50"
                  >
                    <span>Find swaps for {skill.name}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
