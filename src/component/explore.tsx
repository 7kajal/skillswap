"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Check,
  ChevronRight,
  Code2,
  Compass,
  Dumbbell,
  Globe2,
  GraduationCap,
  Languages,
  MapPin,
  Megaphone,
  Music2,
  Palette,
  Search,
  Sparkles,
  Star,
  Users,
  Utensils,
  Camera,
  BrainCircuit,
  BriefcaseBusiness,
  X,
} from "lucide-react";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export type Category = {
  id: string;
  name: string;
  icon: IconType;
  skills: number;
  members: number;
  iconClassName: string;
};

export type Teacher = {
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
};

export type TrendingSkill = {
  id: string;
  name: string;
  teachers: number;
};

const categories: Category[] = [
  {
    id: "development",
    name: "Development",
    icon: Code2,
    skills: 342,
    members: 4210,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    id: "design",
    name: "Design",
    icon: Palette,
    skills: 198,
    members: 2815,
    iconClassName: "bg-violet-50 text-violet-600",
  },
  {
    id: "photography",
    name: "Photography",
    icon: Camera,
    skills: 122,
    members: 1760,
    iconClassName: "bg-rose-50 text-rose-600",
  },
  {
    id: "languages",
    name: "Languages",
    icon: Languages,
    skills: 164,
    members: 2540,
    iconClassName: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "music",
    name: "Music",
    icon: Music2,
    skills: 95,
    members: 1320,
    iconClassName: "bg-pink-50 text-pink-600",
  },
  {
    id: "business",
    name: "Business",
    icon: BriefcaseBusiness,
    skills: 110,
    members: 1485,
    iconClassName: "bg-amber-50 text-amber-600",
  },
  {
    id: "marketing",
    name: "Marketing",
    icon: Megaphone,
    skills: 87,
    members: 1210,
    iconClassName: "bg-orange-50 text-orange-600",
  },
  {
    id: "cooking",
    name: "Cooking",
    icon: Utensils,
    skills: 71,
    members: 965,
    iconClassName: "bg-lime-50 text-lime-700",
  },
  {
    id: "fitness",
    name: "Fitness",
    icon: Dumbbell,
    skills: 64,
    members: 880,
    iconClassName: "bg-cyan-50 text-cyan-600",
  },
  {
    id: "artificial-intelligence",
    name: "AI",
    icon: BrainCircuit,
    skills: 146,
    members: 2190,
    iconClassName: "bg-indigo-50 text-indigo-600",
  },
];

const trendingSkills: TrendingSkill[] = [
  { id: "react", name: "React", teachers: 2314 },
  { id: "nextjs", name: "Next.js", teachers: 1835 },
  { id: "typescript", name: "TypeScript", teachers: 1421 },
  { id: "python", name: "Python", teachers: 2870 },
  { id: "ui-design", name: "UI Design", teachers: 854 },
  { id: "photography", name: "Photography", teachers: 931 },
  { id: "video-editing", name: "Video Editing", teachers: 716 },
  { id: "public-speaking", name: "Public Speaking", teachers: 495 },
  { id: "english", name: "English", teachers: 1623 },
  { id: "canva", name: "Canva", teachers: 1105 },
  { id: "figma", name: "Figma", teachers: 946 },
  { id: "excel", name: "Excel", teachers: 1732 },
];

const teachers: Teacher[] = [
  {
    id: "1",
    name: "Sarah Wilson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&h=240&q=85",
    location: "London, UK",
    role: "Frontend Engineer",
    rating: 4.9,
    reviews: 154,
    match: 96,
    online: true,
    teach: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    learn: ["Photography", "Brand Design"],
  },
  {
    id: "2",
    name: "John Carter",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&h=240&q=85",
    location: "New York, USA",
    role: "Backend Developer",
    rating: 4.8,
    reviews: 126,
    match: 93,
    online: true,
    teach: ["Node.js", "MongoDB", "Express"],
    learn: ["Spanish", "Piano"],
  },
  {
    id: "3",
    name: "Emma Brown",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&h=240&q=85",
    location: "Sydney, Australia",
    role: "Product Designer",
    rating: 4.7,
    reviews: 97,
    match: 91,
    online: false,
    teach: ["UI Design", "Figma", "Canva"],
    learn: ["React", "Next.js"],
  },
  {
    id: "4",
    name: "Michael Lee",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&h=240&q=85",
    location: "Toronto, Canada",
    role: "Machine Learning Engineer",
    rating: 4.9,
    reviews: 212,
    match: 95,
    online: true,
    teach: ["Python", "Machine Learning", "AI"],
    learn: ["Photography", "French"],
  },
  {
    id: "5",
    name: "Sophia Davis",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&h=240&q=85",
    location: "Berlin, Germany",
    role: "Photographer",
    rating: 4.8,
    reviews: 181,
    match: 89,
    online: false,
    teach: ["Photography", "Lightroom"],
    learn: ["React", "AI"],
  },
  {
    id: "6",
    name: "Daniel Kim",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&h=240&q=85",
    location: "Seoul, South Korea",
    role: "Language Mentor",
    rating: 4.6,
    reviews: 88,
    match: 87,
    online: true,
    teach: ["Korean", "Cooking"],
    learn: ["Business", "English"],
  },
  {
    id: "7",
    name: "Olivia Taylor",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=240&q=85",
    location: "Paris, France",
    role: "French Tutor",
    rating: 4.9,
    reviews: 265,
    match: 98,
    online: true,
    teach: ["French", "Baking"],
    learn: ["JavaScript", "React"],
  },
  {
    id: "8",
    name: "Alex Johnson",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&h=240&q=85",
    location: "Mumbai, India",
    role: "Mobile Developer",
    rating: 4.8,
    reviews: 144,
    match: 92,
    online: true,
    teach: ["Flutter", "Firebase"],
    learn: ["UI Design", "Figma"],
  },
];

function SectionHeader({
  badge,
  title,
  description,
  action,
}: {
  badge?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {badge ? (
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600">
            {badge}
          </p>
        ) : null}

        <h2 className="mt-2 text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl">
          {title}
        </h2>

        <p className="mt-3 max-w-xl text-sm font-medium leading-7 text-slate-500 sm:text-base">
          {description}
        </p>
      </div>

      {action}
    </div>
  );
}

function SearchArea({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative mx-auto mt-9 max-w-2xl">
      <div className="absolute -inset-2 rounded-[26px] bg-blue-600/10 blur-xl" />

      <div className="relative flex flex-col gap-2 rounded-[24px] border border-slate-200 bg-white p-2 shadow-[0_18px_55px_rgba(15,23,42,0.09)] sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Search React, French, photography..."
            className="h-14 w-full rounded-2xl bg-transparent pl-12 pr-11 text-sm font-semibold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400"
          />

          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <button
          type="button"
          className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 sm:min-w-32"
        >
          Explore
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-bold text-slate-500">
        <span className="flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5 text-blue-600" />
          No payment required
        </span>

        <span className="flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5 text-blue-600" />
          Verified community
        </span>

        <span className="flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5 text-blue-600" />
          Global skill network
        </span>
      </div>
    </div>
  );
}

function CategoryCard({
  category,
  active,
  onClick,
  index,
}: {
  category: Category;
  active: boolean;
  onClick: () => void;
  index: number;
}) {
  const Icon = category.icon;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      onClick={onClick}
      className={`group min-w-[190px] rounded-[24px] border p-5 text-left transition duration-300 md:min-w-0 ${
        active
          ? "border-blue-500 bg-blue-600 text-white shadow-[0_20px_45px_rgba(37,99,235,0.2)]"
          : "border-slate-200 bg-white text-slate-900 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl transition ${
            active ? "bg-white/15 text-white" : category.iconClassName
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
            active
              ? "bg-white/15 text-white"
              : "border border-slate-200 text-slate-400 group-hover:border-blue-200 group-hover:text-blue-600"
          }`}
        >
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>

      <h3 className="mt-5 text-base font-black">{category.name}</h3>

      <div
        className={`mt-4 flex items-center justify-between border-t pt-4 text-[11px] font-bold ${
          active
            ? "border-white/15 text-blue-100"
            : "border-slate-100 text-slate-500"
        }`}
      >
        <span className="flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" />
          {category.skills} skills
        </span>

        <span>{category.members.toLocaleString()}</span>
      </div>
    </motion.button>
  );
}

function MentorCard({ teacher, index }: { teacher: Teacher; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover={{ y: -7 }}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.045)] transition-shadow hover:border-blue-200 hover:shadow-[0_25px_60px_rgba(37,99,235,0.11)]"
    >
      <div className="relative border-b border-slate-100 bg-slate-50 p-5">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="relative flex items-start justify-between gap-3">
          <div className="relative">
            <img
              src={teacher.avatar}
              alt={teacher.name}
              className="h-16 w-16 rounded-2xl object-cover ring-4 ring-white"
            />

            <span
              className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-[3px] border-white ${
                teacher.online ? "bg-emerald-500" : "bg-slate-300"
              }`}
            />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1.5 text-[10px] font-extrabold text-blue-600">
            <Sparkles className="h-3 w-3" />
            {teacher.match}% match
          </span>
        </div>

        <div className="relative mt-5">
          <div className="flex items-center gap-1.5">
            <h3 className="text-lg font-black tracking-[-0.025em] text-slate-950">
              {teacher.name}
            </h3>

            <BadgeCheck className="h-4 w-4 fill-blue-600 text-white" />
          </div>

          <p className="mt-1 text-xs font-bold text-slate-500">
            {teacher.role}
          </p>

          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <MapPin className="h-3.5 w-3.5" />
            {teacher.location}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-black text-slate-900">
              {teacher.rating}
            </span>
          </div>

          <span className="text-xs font-medium text-slate-400">
            {teacher.reviews} reviews
          </span>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
              Can teach
            </p>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {teacher.teach.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-600"
                >
                  {skill}
                </span>
              ))}

              {teacher.teach.length > 3 ? (
                <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-bold text-slate-500">
                  +{teacher.teach.length - 3}
                </span>
              ) : null}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
              Wants to learn
            </p>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {teacher.learn.slice(0, 2).map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="group/button mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-extrabold text-white transition hover:bg-blue-600"
        >
          View profile
          <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
        </button>
      </div>
    </motion.article>
  );
}

export default function ExploreSkillsSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredTeachers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return teachers;
    }

    return teachers.filter((teacher) => {
      const searchableContent = [
        teacher.name,
        teacher.role,
        teacher.location,
        ...teacher.teach,
        ...teacher.learn,
      ]
        .join(" ")
        .toLowerCase();

      return searchableContent.includes(query);
    });
  }, [searchQuery]);

  const handleTrendingSkill = (skill: string) => {
    setSearchQuery(skill);
  };

  return (
    <section
      id="explore-skills"
      className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute -left-48 top-0 h-[480px] w-[480px] rounded-full bg-blue-200/25 blur-[130px]" />
      <div className="pointer-events-none absolute -right-48 top-[30%] h-[440px] w-[440px] rounded-full bg-indigo-200/20 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Intro and search */}
        <div className="relative overflow-hidden rounded-[34px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-5 py-14 text-center shadow-[0_20px_70px_rgba(37,99,235,0.08)] sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.045)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mx-auto max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-blue-600 shadow-sm backdrop-blur">
              <Compass className="h-4 w-4" />
              Discover your next skill
            </div>

            <h2 className="mt-6 text-4xl font-black leading-[1.02] tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
              Find people who can teach
              <span className="block text-blue-600">
                what you want to learn.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-8 text-slate-600 sm:text-lg">
              Search thousands of skills and connect with trusted members who
              are ready to exchange knowledge instead of money.
            </p>

            <SearchArea value={searchQuery} onChange={setSearchQuery} />
          </motion.div>
        </div>

        {/* Categories */}
        <div className="mt-20">
          <SectionHeader
            badge="Explore categories"
            title="Popular skill communities"
            description="Browse growing communities across technology, creativity, business, languages and everyday skills."
            action={
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className="inline-flex w-fit items-center gap-2 text-sm font-extrabold text-blue-600"
              >
                View all categories
                <ArrowRight className="h-4 w-4" />
              </button>
            }
          />

          <div className="mt-9 flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-5">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
                active={selectedCategory === category.id}
                onClick={() =>
                  setSelectedCategory((current) =>
                    current === category.id ? "all" : category.id,
                  )
                }
              />
            ))}
          </div>
        </div>

        {/* Trending */}
        <div className="mt-20 rounded-[30px] border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-md">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                  <Sparkles className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-950">
                    Trending this week
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    Skills getting the most attention right now.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {trendingSkills.map((skill) => {
                const selected =
                  searchQuery.toLowerCase() === skill.name.toLowerCase();

                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => handleTrendingSkill(skill.name)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-extrabold transition ${
                      selected
                        ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-600"
                    }`}
                  >
                    {skill.name}

                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        selected
                          ? "bg-white/15 text-blue-50"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {skill.teachers.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mentors */}
        <div className="mt-20">
          <SectionHeader
            badge="Recommended matches"
            title={
              searchQuery
                ? `Mentors matching “${searchQuery}”`
                : "People ready to exchange skills"
            }
            description="Explore trusted community members based on skills, interests, ratings and compatibility."
            action={
              <button
                type="button"
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
              >
                Browse all members
                <ArrowRight className="h-4 w-4" />
              </button>
            }
          />

          {filteredTeachers.length > 0 ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filteredTeachers.map((teacher, index) => (
                <MentorCard key={teacher.id} teacher={teacher} index={index} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Search className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-xl font-black text-slate-950">
                No mentors found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">
                Try another skill, topic, location or mentor name.
              </p>

              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="relative mt-20 overflow-hidden rounded-[34px] bg-slate-950 px-6 py-12 text-white shadow-[0_28px_80px_rgba(15,23,42,0.22)] sm:px-10 sm:py-14 lg:px-14"
        >
          <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-blue-600/35 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-indigo-600/20 blur-[100px]" />

          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue-300">
                <GraduationCap className="h-4 w-4" />
                Join the exchange
              </div>

              <h2 className="mt-5 text-3xl font-black leading-tight tracking-[-0.045em] sm:text-4xl">
                Your knowledge could unlock someone else’s next skill.
              </h2>

              <p className="mt-4 max-w-xl text-sm font-medium leading-7 text-slate-400 sm:text-base">
                Create your profile, list what you can teach and connect with
                people who can help you grow.
              </p>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-blue-400" />
                  Free profile
                </span>

                <span className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-blue-400" />
                  No payments
                </span>

                <span className="flex items-center gap-1.5">
                  <Globe2 className="h-4 w-4 text-blue-400" />
                  Global community
                </span>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-sm font-extrabold text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-500"
              >
                Create your profile
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-extrabold text-white transition hover:bg-white/10"
              >
                Browse all skills
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
