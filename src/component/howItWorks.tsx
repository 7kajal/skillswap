"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  MessageCircle,
  Mic,
  Search,
  Sparkles,
  Video,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const stepCopy = [
  {
    number: "01",
    title: "Search your skill and find the match",
    description:
      "Tell us what you want to learn and discover people whose skills complement yours.",
  },
  {
    number: "02",
    title: "Schedule the session",
    description:
      "Choose a time that works for both of you and keep every exchange easy to manage.",
  },
  {
    number: "03",
    title: "Start Skill Swap",
    description:
      "Meet, share what you know and leave with a practical new skill—no money involved.",
  },
];

function SearchDemo() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative h-full overflow-hidden px-5 pt-6">
      <div className="flex h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 shadow-sm">
        <Search className="h-4 w-4 text-blue-600" />
        <span className="text-xs font-bold text-slate-700">UI design</span>
        <motion.span
          animate={reduceMotion ? undefined : { opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="h-4 w-px bg-blue-600"
        />
      </div>

      <div className="mt-4 space-y-2.5">
        {[
          ["AM", "Aarav", "Figma · UX research", "98%"],
          ["SK", "Sana", "Product design", "94%"],
        ].map((person, index) => (
          <motion.div
            key={person[1]}
            animate={
              reduceMotion
                ? undefined
                : { y: index === 0 ? [4, 0, 4] : [7, 2, 7] }
            }
            transition={{ duration: 3.2, delay: index * 0.35, repeat: Infinity }}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-[10px] font-black text-blue-700">
              {person[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-slate-900">{person[1]}</p>
              <p className="truncate text-[10px] font-medium text-slate-400">{person[2]}</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-black text-emerald-600">
              {person[3]}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ScheduleDemo() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="h-full px-5 pt-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black text-slate-900">
            <CalendarDays className="h-4 w-4 text-blue-600" />
            This week
          </div>
          <span className="text-[9px] font-bold text-slate-400">IST</span>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-1.5">
          {["M", "T", "W", "T", "F"].map((day, index) => (
            <div key={`${day}-${index}`} className="text-center">
              <p className="text-[9px] font-bold text-slate-400">{day}</p>
              <motion.div
                animate={
                  reduceMotion || index !== 2
                    ? undefined
                    : { scale: [1, 1.08, 1], boxShadow: ["0 0 0 rgba(37,99,235,0)", "0 8px 18px rgba(37,99,235,.24)", "0 0 0 rgba(37,99,235,0)"] }
                }
                transition={{ duration: 2.4, repeat: Infinity }}
                className={`mt-1 flex h-8 items-center justify-center rounded-lg text-[10px] font-black ${
                  index === 2
                    ? "bg-blue-600 text-white"
                    : "bg-slate-50 text-slate-600"
                }`}
              >
                {18 + index}
              </motion.div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between rounded-xl bg-blue-50 px-3 py-2.5">
          <span className="flex items-center gap-1.5 text-[10px] font-black text-blue-700">
            <Clock3 className="h-3.5 w-3.5" /> 4:00 PM
          </span>
          <motion.span
            animate={reduceMotion ? undefined : { scale: [1, 1.12, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white"
          >
            <Check className="h-3 w-3" />
          </motion.span>
        </div>
      </div>
    </div>
  );
}

function SessionDemo() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="h-full px-5 pt-5">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-sm">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="ml-auto flex items-center gap-1 text-[8px] font-bold text-white/50">
            <motion.span
              animate={reduceMotion ? undefined : { opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
            />
            Live
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 p-2">
          <div className="flex h-24 flex-col items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-blue-700">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-[10px] font-black text-white">YOU</span>
            <span className="mt-2 text-[9px] font-bold text-white/80">Teaching React</span>
          </div>
          <div className="flex h-24 flex-col items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-indigo-700">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-[10px] font-black text-white">AK</span>
            <span className="mt-2 text-[9px] font-bold text-white/80">Teaching Figma</span>
          </div>
        </div>
        <div className="flex justify-center gap-2 pb-3">
          {[Mic, Video, MessageCircle].map((Icon, index) => (
            <span key={index} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white">
              <Icon className="h-3 w-3" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const demos: ReactNode[] = [<SearchDemo key="search" />, <ScheduleDemo key="schedule" />, <SessionDemo key="session" />];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-white py-24 sm:py-28">
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-100/60 blur-[130px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-blue-600">
            <Sparkles className="h-3.5 w-3.5" /> How it works
          </div>
          <h2 className="mt-5 text-4xl font-black tracking-[-0.055em] text-slate-950 sm:text-5xl">
            Skill swapping made simple.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-8 text-slate-500">
            From finding the right person to starting your session, every step is designed to feel effortless.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {stepCopy.map((step, index) => (
            <motion.article
              key={step.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_24px_60px_rgba(37,99,235,0.12)]"
            >
              <div className="p-6 pb-5">
                <span className="inline-flex rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500">
                  {step.number}
                </span>
                <h3 className="mt-4 min-h-14 text-xl font-black leading-7 tracking-[-0.035em] text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                  {step.description}
                </p>
              </div>
              <div className="h-64 border-t border-slate-100 bg-slate-50/80">
                {demos[index]}
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/auth/register" className="group inline-flex items-center gap-2 text-sm font-black text-blue-600">
            Start your first skill swap
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
