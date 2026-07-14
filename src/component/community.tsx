import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Camera,
  Check,
  ChevronRight,
  Code2,
  Compass,
  Dumbbell,
  Globe2,
  GraduationCap,
  HeartHandshake,
  Languages,
  MapPin,
  Menu,
  MessageCircle,
  Music2,
  Palette,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Utensils,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type Member = {
  id: string;
  name: string;
  avatar: string;
  role: string;
  location: string;
  rating: number;
  reviews: number;
  match: number;
  online: boolean;
  teaches: string[];
  learning: string[];
};

const members: Member[] = [
  {
    id: "1",
    name: "Sarah Wilson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=85",
    role: "Frontend Engineer",
    location: "London, UK",
    rating: 4.9,
    reviews: 154,
    match: 96,
    online: true,
    teaches: ["React", "Next.js", "TypeScript"],
    learning: ["Photography", "Brand Design"],
  },
  {
    id: "2",
    name: "Emma Brown",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&h=300&q=85",
    role: "Product Designer",
    location: "Sydney, Australia",
    rating: 4.8,
    reviews: 126,
    match: 94,
    online: true,
    teaches: ["UI Design", "Figma", "Canva"],
    learning: ["React", "Next.js"],
  },
  {
    id: "3",
    name: "Michael Lee",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=300&q=85",
    role: "Machine Learning Engineer",
    location: "Toronto, Canada",
    rating: 4.9,
    reviews: 212,
    match: 95,
    online: false,
    teaches: ["Python", "Machine Learning", "AI"],
    learning: ["French", "Photography"],
  },
  {
    id: "4",
    name: "Olivia Taylor",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=85",
    role: "Language Mentor",
    location: "Paris, France",
    rating: 5,
    reviews: 265,
    match: 98,
    online: true,
    teaches: ["French", "Baking"],
    learning: ["JavaScript", "React"],
  },
];

const steps = [
  {
    number: "01",
    icon: GraduationCap,
    title: "Add what you can teach",
    description:
      "Build a profile around your real skills, knowledge and experience.",
  },
  {
    number: "02",
    icon: Search,
    title: "Find what you want to learn",
    description:
      "Search members, compare compatibility and discover a fair exchange.",
  },
  {
    number: "03",
    icon: HeartHandshake,
    title: "Agree on the exchange",
    description:
      "Decide what each person shares, how you will meet and what success means.",
  },
  {
    number: "04",
    icon: Sparkles,
    title: "Learn and grow together",
    description:
      "Complete sessions, exchange feedback and build a trusted network.",
  },
];

export function ExchangeShowcase() {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600">
            Smart skill matching
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.055em] text-slate-950 sm:text-5xl">
            Find an exchange where both sides win.
          </h2>

          <p className="mt-5 max-w-lg text-base font-medium leading-8 text-slate-600">
            SkillSwap looks beyond a basic search. Discover people based on what
            they teach, what they want to learn and how well your needs align.
          </p>

          <div className="mt-8 space-y-4">
            {[
              "Search by skill, category or location",
              "Compare compatibility before connecting",
              "Agree on sessions and expectations",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Check className="h-4 w-4" />
                </span>
                <p className="text-sm font-bold text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[34px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-5 sm:p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-300/30 blur-[90px]" />

          <div className="relative rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_28px_80px_rgba(37,99,235,0.13)] sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-blue-600">
                  Recommended match
                </p>
                <h3 className="mt-1 text-xl font-black text-slate-950">
                  Strong exchange opportunity
                </h3>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-600">
                96% match
              </span>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <img
                src={members[0].avatar}
                alt={members[0].name}
                className="h-16 w-16 rounded-2xl object-cover"
              />

              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-black text-slate-950">{members[0].name}</p>
                  <BadgeCheck className="h-4 w-4 fill-blue-600 text-white" />
                </div>

                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {members[0].role} · {members[0].location}
                </p>
              </div>
            </div>

            <div className="mt-6 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-slate-400">
                  Can teach
                </p>
                <p className="mt-2 font-black text-slate-900">
                  React & Next.js
                </p>
              </div>

              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                <HeartHandshake className="h-4 w-4" />
              </div>

              <div className="rounded-2xl bg-blue-50 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-blue-500">
                  Wants to learn
                </p>
                <p className="mt-2 font-black text-slate-900">Photography</p>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button className="flex-1 rounded-xl bg-blue-600 py-3.5 text-sm font-extrabold text-white">
                Connect
              </button>

              <button className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 text-slate-500">
                <MessageCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Community() {
  return (
    <section id="community" className="bg-slate-50 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600">
              Community members
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.055em] text-slate-950 sm:text-5xl">
              Learn from people, not content libraries.
            </h2>

            <p className="mt-5 text-base font-medium leading-8 text-slate-600">
              Meet experienced people who are ready to teach, learn and
              contribute.
            </p>
          </div>

          <button className="inline-flex w-fit items-center gap-2 text-sm font-extrabold text-blue-600">
            Browse all members
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member, index) => (
            <motion.article
              key={member.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -7 }}
              className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)] transition-shadow hover:border-blue-200 hover:shadow-[0_25px_60px_rgba(37,99,235,0.1)]"
            >
              <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 p-5">
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-16 w-16 rounded-2xl object-cover ring-4 ring-white"
                    />

                    <span
                      className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-[3px] border-white ${
                        member.online ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    />
                  </div>

                  <span className="rounded-full border border-blue-100 bg-white px-2.5 py-1.5 text-[10px] font-extrabold text-blue-600">
                    {member.match}% match
                  </span>
                </div>

                <div className="mt-5">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-black text-slate-950">
                      {member.name}
                    </h3>
                    <BadgeCheck className="h-4 w-4 fill-blue-600 text-white" />
                  </div>

                  <p className="mt-1 text-xs font-bold text-slate-500">
                    {member.role}
                  </p>

                  <p className="mt-2 flex items-center gap-1 text-xs font-medium text-slate-400">
                    <MapPin className="h-3.5 w-3.5" />
                    {member.location}
                  </p>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-black text-slate-900">
                    {member.rating}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({member.reviews})
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                    Teaches
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {member.teaches.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-extrabold text-white transition hover:bg-slate-600">
                  View profile
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
