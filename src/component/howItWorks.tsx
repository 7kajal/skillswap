"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  MessageCircle,
  Mic,
  MicOff,
  Search,
  Sparkles,
  Video,
  VideoOff,
  Star,
  Award,
  RefreshCw,
} from "lucide-react";
import type { AuthStatus } from "@/types/auth";
import type { HowItWorksProps } from "@/types/home";

const stepCopy = [
  {
    number: "01",
    title: "Search skill and find the match",
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
  const [activeQueryIndex, setActiveQueryIndex] = useState(0);
  const queries = ["UI design", "React.js", "System Design", "Figma Systems"];
  const [selectedPerson, setSelectedPerson] = useState<string | null>("Aarav");

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveQueryIndex((prev) => (prev + 1) % queries.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const candidates = [
    { id: "AM", name: "Aarav", skills: "Figma · UX research", match: "98%" },
    { id: "SK", name: "Sana", skills: "Product design", match: "94%" },
  ];

  return (
    <div className="relative h-full overflow-hidden px-5 pt-5 pb-4 flex flex-col justify-between select-none">
      {/* Animated Search Bar */}
      <div>
        <div className="flex h-11 items-center gap-2.5 rounded-xl border border-slate-200/90 bg-white px-3.5 shadow-sm transition-all hover:border-blue-300">
          <Search className="h-4 w-4 text-blue-600 flex-shrink-0" />
          <AnimatePresence mode="wait">
            <motion.span
              key={queries[activeQueryIndex]}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
              className="text-xs font-bold text-slate-800"
            >
              {queries[activeQueryIndex]}
            </motion.span>
          </AnimatePresence>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.9, repeat: Infinity }}
            className="h-4 w-0.5 rounded-full bg-blue-600"
          />
        </div>

        {/* Floating Candidate Cards */}
        <div className="mt-3.5 space-y-2">
          {candidates.map((person, index) => {
            const isSelected = selectedPerson === person.name;
            return (
              <motion.div
                key={person.name}
                onClick={() => setSelectedPerson(person.name)}
                initial={{ opacity: 0, y: 12 }}
                animate={{
                  opacity: 1,
                  y: isSelected ? 0 : [0, -3, 0],
                }}
                transition={{
                  y: {
                    duration: 3,
                    repeat: isSelected ? 0 : Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: index * 0.4,
                  },
                }}
                whileHover={{ scale: 1.02 }}
                className={`cursor-pointer flex items-center gap-3 rounded-xl border p-2.5 shadow-sm transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/10"
                    : "border-slate-200/80 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-[10px] font-black text-blue-700 shadow-inner">
                  {person.id}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    {person.name}
                    {isSelected && (
                      <span className="text-[9px] font-bold text-blue-600">
                        • Selected
                      </span>
                    )}
                  </p>
                  <p className="truncate text-[10px] font-medium text-slate-400">
                    {person.skills}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 text-[9px] font-black text-emerald-600">
                  {person.match}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Match Confirmation Banner */}
      <div className="rounded-lg bg-blue-50/70 border border-blue-100/80 p-2 text-center text-[10px] font-bold text-blue-700 flex items-center justify-between">
        <span>Complementary Swap Found</span>
        <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[9px]">
          100% Free
        </span>
      </div>
    </div>
  );
}

function ScheduleDemo() {
  const [selectedDay, setSelectedDay] = useState(2); // Wednesday (index 2)
  const [selectedTime, setSelectedTime] = useState("4:00 PM");
  const timeSlots = ["2:00 PM", "4:00 PM", "6:30 PM"];

  return (
    <div className="h-full px-5 pt-6 pb-4 flex flex-col justify-between select-none">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black text-slate-900">
            <CalendarDays className="h-4 w-4 text-blue-600" />
            This week
          </div>
        </div>

        {/* Days Grid */}
        <div className="mt-3.5 grid grid-cols-5 gap-1.5">
          {["M", "T", "W", "T", "F"].map((day, index) => {
            const isCurrent = selectedDay === index;
            return (
              <div key={`${day}-${index}`} className="text-center">
                <p className="text-[9px] font-bold text-slate-400 mb-1">
                  {day}
                </p>
                <motion.button
                  onClick={() => setSelectedDay(index)}
                  whileTap={{ scale: 0.95 }}
                  animate={
                    isCurrent
                      ? {
                          scale: [1, 1.05, 1],
                          boxShadow: [
                            "0 0 0 rgba(37,99,235,0)",
                            "0 6px 16px rgba(37,99,235,.25)",
                            "0 0 0 rgba(37,99,235,0)",
                          ],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2.2,
                    repeat: isCurrent ? Infinity : 0,
                  }}
                  className={`w-full flex h-8 items-center justify-center rounded-lg text-[10px] font-black transition-colors ${
                    isCurrent
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {18 + index}
                </motion.button>
              </div>
            );
          })}
        </div>

        {/* Time Slot Picker */}
        <div className="mt-3.5 grid grid-cols-3 gap-1.5">
          {timeSlots.map((time) => {
            const isSelected = selectedTime === time;
            return (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`py-1.5 px-2 rounded-lg text-[10px] font-extrabold transition-all ${
                  isSelected
                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>

        {/* Active Slot Status Pill */}
        <div className="mt-3 flex items-center justify-between rounded-xl bg-blue-50 px-3 py-2 border border-blue-100">
          <span className="flex items-center gap-1.5 text-[10px] font-black text-blue-700">
            <Clock3 className="h-3.5 w-3.5 text-blue-600" /> Wed{" "}
            {18 + selectedDay} @ {selectedTime}
          </span>
          <motion.span
            key={selectedTime + selectedDay}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [stars, setStars] = useState(5);

  return (
    <div className="h-full px-4 sm:px-5 pt-5 sm:pt-6 pb-4 flex flex-col justify-between select-none">
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-md">
        {/* Live Bar Header */}
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-1.5 bg-slate-900/60">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="ml-auto flex items-center gap-1.5 text-[8px] font-bold text-white/60">
            <motion.span
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
            />
            45:00 Live
          </span>
        </div>

        {/* Video Call Tiles Grid */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-2 p-3 sm:p-3.5">
          {/* YOU Tile */}
          <div className="relative flex h-24 sm:h-26 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 p-2 shadow">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-[9px] font-black text-white shadow-inner">
              YOU
            </span>
            <span className="mt-1 text-[8px] font-bold text-white/90">
              Teaching React
            </span>

            {/* Audio Wave Bar Simulation */}
            {micActive && (
              <div className="absolute bottom-1.5 flex items-center gap-0.5">
                {[0.4, 0.8, 0.3, 0.9, 0.5].map((h, i) => (
                  <motion.span
                    key={i}
                    animate={{ scaleY: [0.3, h * 1.8, 0.3] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                    className="h-2 w-0.5 rounded-full bg-white/80"
                  />
                ))}
              </div>
            )}
          </div>

          {/* AK Tile */}
          <div className="relative flex h-24 sm:h-26 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-800 p-2 shadow">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-[9px] font-black text-white shadow-inner">
              AK
            </span>
            <span className="mt-1 text-[8px] font-bold text-white/90">
              Learning React
            </span>

            {/* Peer Audio Visualizer */}
            <div className="absolute bottom-1.5 flex items-center gap-0.5">
              {[0.6, 0.3, 0.7, 0.4].map((h, i) => (
                <motion.span
                  key={i}
                  animate={{ scaleY: [0.2, h * 1.5, 0.2] }}
                  transition={{
                    duration: 0.7,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                  className="h-2 w-0.5 rounded-full bg-emerald-300"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Video Controls Bar */}
        <div className="flex items-center justify-between border-t border-white/10 px-3 sm:px-3.5 py-3 sm:py-4 bg-slate-900/80">
          <div className="flex gap-2.5 sm:gap-2">
            <button
              onClick={() => setMicActive(!micActive)}
              className={`flex  px-3.5 md:px-0 sm:h-8 sm:w-8 items-center justify-center rounded-full transition-colors ${
                micActive
                  ? "bg-white/15 text-white"
                  : "bg-rose-500/80 text-white"
              }`}
            >
              {micActive ? (
                <Mic className="h-4 w-4 sm:h-4 sm:w-4" />
              ) : (
                <MicOff className="h-4 w-4 sm:h-4 sm:w-4" />
              )}
            </button>

            <button
              onClick={() => setVideoActive(!videoActive)}
              className={`flex px-3.5 md:px-0 sm:h-8 sm:w-8 items-center justify-center rounded-full transition-colors ${
                videoActive
                  ? "bg-white/15 text-white"
                  : "bg-rose-500/80 text-white"
              }`}
            >
              {videoActive ? (
                <Video className="h-4 w-4 sm:h-4 sm:w-4" />
              ) : (
                <VideoOff className="h-4 w-4 sm:h-4 sm:w-4" />
              )}
            </button>

            <button className="flex px-3.5 md:px-0 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/15 text-white">
              <MessageCircle className="h-4 w-4 sm:h-4 sm:w-4" />
            </button>
          </div>

          <button
            onClick={() => setShowRating(!showRating)}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500/20 px-4 py-0 sm:px-2 sm:py-1 text-[8px] sm:text-[8px] font-bold text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
          >
            <Award className="h-3 w-3 sm:h-2.5 sm:w-2.5 text-amber-400" />
            {showRating ? "Hide Rep" : "Swap Done"}
          </button>
        </div>
      </div>

      {/* Completion & Reputation Popover */}
      {showRating && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 rounded-xl bg-amber-50 border border-amber-200/80 p-2 flex items-center justify-between text-[10px]"
        >
          <div className="flex items-center gap-1.5 font-bold text-amber-800">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            +50 Rep Earned
          </div>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                onClick={() => setStars(s)}
                className={`h-3 w-3 cursor-pointer ${
                  s <= stars
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300"
                }`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

const demos = [
  <SearchDemo key="search" />,
  <ScheduleDemo key="schedule" />,
  <SessionDemo key="session" />,
];

export function HowItWorks({
  authStatus = "unauthenticated",
}: HowItWorksProps) {
  const [currentAuthStatus, setCurrentAuthStatus] =
    useState<AuthStatus>(authStatus);

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-white py-24 sm:py-28"
    >
      {/* Background Subtle Gradient Glow */}
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-100/60 blur-[130px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className=" items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-blue-600 ">
            How it works
          </div>
          <h2 className="mt-1 text-3xl font-black tracking-[-0.055em] text-slate-950 sm:text-4xl lg:text-5xl">
            Skill swapping made simple.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-8 text-slate-500">
            From finding the right person to starting your session, every step
            is designed to feel effortless.
          </p>
        </div>

        {/* 3 Step Article Cards Grid */}
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {stepCopy.map((step, index) => (
            <motion.article
              key={step.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_24px_60px_rgba(37,99,235,0.12)] flex flex-col justify-between"
            >
              <div className="p-6">
                <span className="inline-flex  px-2 py-1 text-[10px] font-black text-slate-500">
                  {step.number}
                </span>
                <h3 className=" min-h-8 text-xl font-black leading-7 tracking-[-0.035em] text-slate-950">
                  {step.title}
                </h3>
                <p className=" text-xs font-medium leading-6 text-slate-500">
                  {step.description}
                </p>
              </div>

              {/* Demo Section Container */}
              <div className="h-64 border-t border-slate-100 bg-slate-50/80">
                {demos[index]}
              </div>
            </motion.article>
          ))}
        </div>

        {/* Dynamic CTA Link at Bottom */}
        {/* <div className="mt-10 flex justify-center">
          {currentAuthStatus === "loading" ? (
            <span
              className="h-5 w-44 animate-pulse rounded bg-slate-100"
              aria-label="Loading account actions"
            />
          ) : (
            <a
              href={currentAuthStatus === "authenticated" ? "#discover" : "#register"}
              className="group inline-flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-700 transition-colors"
            >
              {currentAuthStatus === "authenticated"
                ? "Find a skill match"
                : "Start your first skill swap"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          )}
        </div> */}
      </div>
    </section>
  );
}
