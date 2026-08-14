import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  MapPin,
  Star,
  Sparkles,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import type {
  CommunityProps,
  ExchangeShowcaseProps,
} from "@/types/home";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ExchangeShowcase({
  member,
  loading,
  authStatus,
}: ExchangeShowcaseProps) {
  // Derive a complement match dynamically based on the member's teaches/learning
  const partner = member
    ? {
        name:
          member.teaches.includes("React") || member.learning.includes("Figma")
            ? "Lucas Garcia"
            : "Aarav Patel",
        avatar: "",
        location: member.location?.includes("India")
          ? "Barcelona, Spain"
          : "Mumbai, India",
        teaches:
          member.learning.length > 0 ? [member.learning[0]] : ["UI Design"],
        learning: member.teaches.length > 0 ? [member.teaches[0]] : ["React"],
      }
    : null;

  return (
    <section className="relative overflow-hidden bg-slate-50/10 py-24 text-slate-950 sm:py-32 border-b border-slate-100">
      {/* Background Subtle Mesh */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-blue-100/35 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 -bottom-40 h-[450px] w-[450px] rounded-full bg-blue-100/35 blur-[120px]" />
      <div className="absolute -left-48 top-5 h-[540px] w-[540px] rounded-full bg-blue-200/35 blur-[140px]" />
      <div className="absolute -right-48 top-0 h-[560px] w-[560px] rounded-full bg-blue-200/35 blur-[150px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        {/* Left Column: Heading & Value Proposition */}
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.16em] uppercase text-blue-600">
            Community Swaps
          </div>

          <h2 className="mt-1 text-3xl font-black tracking-[-0.055em] text-slate-950 sm:text-4xl lg:text-5xl lg:leading-[1.12]">
            Connect and swap skills
          </h2>

          <p className="mt-5 text-sm font-semibold leading-8 text-slate-500">
            Skip the generic pre-recorded video libraries. Trade knowledge
            directly through live, personalized interactive sessions.
          </p>

          <div className="mt-8 space-y-4">
            {[
              "Mutual value exchange with peer-to-peer mentoring",
              "Dynamic skill matching based on complementary needs",
              "Build reputation credits with each successful swap",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <p className="text-sm font-bold text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Dynamic Member Spotlight & Connector */}
        <div className="lg:col-span-7">
          <div className="relative rounded-[36px] border border-slate-200/90 bg-white p-6 shadow-xl sm:p-8 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="relative flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-600">
                  DYNAMIC MATCH PREVIEW
                </span>
              </div>
              {member && (
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-600 border border-emerald-100">
                  {member.completedSwaps} completed{" "}
                  {member.completedSwaps === 1 ? "swap" : "swaps"}
                </span>
              )}
            </div>

            {loading ? (
              <div className="mt-6 space-y-6" aria-label="Loading spotlight">
                <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
                  <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
                </div>
                <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
              </div>
            ) : !member || !partner ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center text-center py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <HeartHandshake className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-xl font-black text-slate-950">
                  Be the first featured member
                </h3>
                <p className="mt-2 max-w-sm text-sm font-medium leading-6 text-slate-500">
                  Complete your profile and add the skills you can teach to
                  appear in the community.
                </p>
                {authStatus !== "loading" && (
                  <Link
                    href={
                      authStatus === "authenticated"
                        ? "/profile/complete"
                        : "/auth/register"
                    }
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-blue-700"
                  >
                    {authStatus === "authenticated"
                      ? "Manage your profile"
                      : "Create your profile"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            ) : (
              <div className="relative mt-2 space-y-6">
                {/* Two cards linked with visual layout */}
                <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                  {/* Member 1 (Featured) */}
                  <div className="md:col-span-5 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-xs relative">
                    <div className="flex items-center gap-3">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="h-11 w-11 rounded-xl object-cover ring-2 ring-blue-100"
                        />
                      ) : (
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xs font-black text-white">
                          {initials(member.name)}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-bold text-slate-950">
                          {member.name}
                        </h4>
                        <p className="truncate text-[10px] text-slate-400 font-semibold flex items-center gap-0.5">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {member.location || "India"}
                        </p>
                      </div>
                    </div>
                    {/* Skills Box */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex flex-col gap-2">
                        <div>
                          <span className="text-[9px] font-black uppercase text-blue-600 tracking-wider">
                            TEACHES
                          </span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {member.teaches.slice(0, 2).map((s) => (
                              <span
                                key={s}
                                className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider font-semibold">
                            WANTS
                          </span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {member.learning.slice(0, 2).map((s) => (
                              <span
                                key={s}
                                className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Connector Arrow */}
                  <div className="md:col-span-1 flex flex-col items-center justify-center py-2 md:py-0">
                    <div className="h-9 w-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs animate-pulse">
                      <HeartHandshake className="h-4 w-4" />
                    </div>
                    <div className="w-px h-6 bg-dashed border-r border-blue-200 md:hidden block" />
                  </div>

                  {/* Member 2 (Matching Partner) */}
                  <div className="md:col-span-5 rounded-2xl border border-blue-100 bg-blue-50/20 p-4 shadow-xs relative">
                    <div className="flex items-center gap-3">
                      {partner.avatar ? (
                        <img
                          src={partner.avatar}
                          alt={partner.name}
                          className="h-11 w-11 rounded-xl object-cover ring-2 ring-blue-100"
                        />
                      ) : (
                        <div className="bg-blue-100  rounded-xl">
                          <div className="flex h-11 w-11 items-center justify-center  rounded-xl object-cover ring-2 ring-blue-200 text-xs font-black text-black">
                            {initials(partner.name)}
                          </div>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-bold text-slate-950">
                          {partner.name}
                        </h4>
                        <p className="truncate text-[10px] text-blue-500 font-semibold flex items-center gap-0.5">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {partner.location}
                        </p>
                      </div>
                      <span className="absolute -top-2.5 -right-2 bg-blue-600 text-white text-[8px] font-black tracking-wider px-2 py-0.5 rounded-full border border-blue-100 shadow-xs uppercase">
                        Swap Match
                      </span>
                    </div>
                    {/* Skills Box */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex flex-col gap-2">
                        <div>
                          <span className="text-[9px] font-black uppercase text-blue-600 tracking-wider">
                            TEACHES
                          </span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {partner.teaches.map((s) => (
                              <span
                                key={s}
                                className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider font-semibold">
                            WANTS
                          </span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {partner.learning.map((s) => (
                              <span
                                key={s}
                                className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Meta Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href={`/profile/${member.id}`}
                    className="flex-1 flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 font-extrabold text-white transition hover:bg-blue-700 shadow-sm"
                  >
                    Connect with {member.name}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/discover"
                    className="flex-1 flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white font-extrabold text-slate-600 transition hover:bg-slate-50 hover:border-slate-300"
                  >
                    Match more people
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Community({
  members,
  loading,
}: CommunityProps) {
  return (
    <section
      id="community"
      className="bg-slate-50/40 py-24 sm:py-32 border-b border-slate-100 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600">
              Community Members
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.055em] text-slate-950 sm:text-4xl lg:text-5xl">
              Learn from people, not libraries.
            </h2>
          </div>

          {/* <Link
            href="/discover"
            className="group inline-flex items-center gap-2 text-sm font-extrabold text-blue-600 transition hover:text-blue-700"
          >
            Browse all members
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link> */}
        </div>

        {loading ? (
          /* Loading Skeletons in Scroll Row */
          <div className="mt-12 flex gap-4 sm:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-5 px-5 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-[340px] w-[69%] min-w-[240px] sm:w-[calc(50%-12px)] lg:w-[calc((100%-3rem)/3)] shrink-0 snap-start animate-pulse rounded-[28px] border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="mt-12 rounded-[28px] border border-dashed border-slate-300 bg-white p-12 text-center">
            <Zap className="mx-auto h-8 w-8 text-slate-400" />
            <h3 className="mt-4 text-xl font-black text-slate-950">
              No completed profiles yet
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Community members will appear here after completing their
              profiles.
            </p>
          </div>
        ) : (
          /* Scrollable Horizontal Container */
          <div className="mt-12 flex gap-4 sm:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pl-5 sm:pl-6 lg:pl-8 pr-5 sm:pr-6 lg:pr-8">
            {members.map((member, index) => (
              <motion.article
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group relative flex w-[69%] min-w-[240px] sm:w-[calc(50%-12px)] lg:w-[calc((100%-1rem)/3.5)] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_12px_35px_rgba(15,23,42,0.04)] transition-all duration-300 hover:translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_55px_rgba(37,99,235,0.08)] animate-in fade-in"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {member.avatar ? (
                        <div className="h-12 w-12 shrink-0 rounded-2xl overflow-hidden ring-2 ring-slate-100 group-hover:ring-blue-100 transition-all duration-300">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-xs font-black text-white">
                          {initials(member.name)}
                        </span>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-black text-sm text-slate-950 transition group-hover:text-blue-600 truncate">
                          {member.name}
                        </h3>
                        {member.location && (
                          <p className="flex items-center gap-0.5 text-[10px] font-semibold text-slate-400 truncate">
                            <MapPin className="h-3 w-3 shrink-0" />
                            {member.location}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 rounded-full border border-amber-100 bg-amber-50/50 px-2 py-0.5 text-[10px] font-black text-slate-700">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>
                        {member.reviewCount > 0
                          ? member.rating.toFixed(1)
                          : "New"}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 line-clamp-2 text-xs font-bold leading-5 text-slate-500">
                    {member.bio || "SkillSwap community member"}
                  </p>

                  {/* Skills Grid */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.12em] text-blue-600">
                        Can Teach
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {member.teaches.slice(0, 2).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-lg bg-blue-50/60 border border-blue-100/50 px-2 py-0.5 text-[10px] font-bold text-blue-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    {member.learning && member.learning.length > 0 && (
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400 font-semibold">
                          Wants to Learn
                        </span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {member.learning.slice(0, 2).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-lg bg-slate-50 border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Link
                  href={`/profile/${member.id}`}
                  className="mt-4 flex items-center justify-center rounded-xl bg-blue-600 border border-blue-600 px-4 py-2.5 text-xs font-extrabold text-white transition duration-300 hover:bg-blue-700 hover:border-blue-700"
                >
                  <span>View profile</span>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
