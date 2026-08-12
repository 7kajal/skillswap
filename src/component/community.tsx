import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  HeartHandshake,
  MapPin,
  Star,
} from "lucide-react";
import type { HomeMember } from "@/app/api/home/types";

type AuthStatus = "authenticated" | "loading" | "unauthenticated";

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
}: {
  member?: HomeMember;
  loading: boolean;
  authStatus: AuthStatus;
}) {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600">
            Active community
          </p>

          <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.055em] text-slate-950 sm:text-4xl lg:text-5xl">
            Learn from people who complete real swaps.
          </h2>

          <p className="mt-5 max-w-lg text-base font-medium leading-8 text-slate-600">
            Explore completed profiles, see what each member can teach and learn,
            and connect around a clear exchange.
          </p>

          <div className="mt-8 space-y-4">
            {[
              "Browse skills added by real members",
              "See completed swaps and community reviews",
              "Open a profile before sending a request",
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

          <div className="relative min-h-[390px] rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_28px_80px_rgba(37,99,235,0.13)] sm:p-6">
            {loading ? (
              <div className="space-y-6" aria-label="Loading featured community member">
                <div className="h-14 animate-pulse rounded-2xl bg-slate-100" />
                <div className="flex items-center gap-4"><div className="h-16 w-16 animate-pulse rounded-2xl bg-slate-100" /><div className="h-12 flex-1 animate-pulse rounded-xl bg-slate-100" /></div>
                <div className="grid gap-3 sm:grid-cols-2"><div className="h-24 animate-pulse rounded-2xl bg-slate-100" /><div className="h-24 animate-pulse rounded-2xl bg-slate-100" /></div>
                <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
              </div>
            ) : !member ? (
              <div className="flex min-h-[340px] flex-col items-center justify-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><HeartHandshake className="h-6 w-6" /></span>
                <h3 className="mt-5 text-xl font-black text-slate-950">Be the first featured member</h3>
                <p className="mt-2 max-w-sm text-sm font-medium leading-6 text-slate-500">Complete your profile and add the skills you can teach to appear in the community.</p>
                {authStatus === "loading" ? (
                  <span className="mt-6 h-12 w-44 animate-pulse rounded-xl bg-slate-100" aria-label="Loading account actions" />
                ) : (
                  <Link href={authStatus === "authenticated" ? "/profile/complete" : "/auth/register"} className="mt-6 inline-flex h-12 items-center rounded-xl bg-blue-600 px-5 text-sm font-extrabold text-white">
                    {authStatus === "authenticated" ? "Manage your profile" : "Create your profile"}
                  </Link>
                )}
              </div>
            ) : (
              <>
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-blue-600">
                  Community spotlight
                </p>
                <h3 className="mt-1 text-xl font-black text-slate-950">
                  Experienced skill sharer
                </h3>
              </div>

              <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
                {member.completedSwaps} completed {member.completedSwaps === 1 ? "swap" : "swaps"}
              </span>
            </div>

            <div className="mt-6 flex items-center gap-4">
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} className="h-16 w-16 rounded-2xl object-cover" />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-sm font-black text-white">{initials(member.name)}</span>
              )}

              <div className="min-w-0">
                <p className="truncate font-black text-slate-950">{member.name}</p>

                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {member.location || "Location not added"}
                </p>
              </div>
            </div>

            <div className="mt-6 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-slate-400">
                  Can teach
                </p>
                <p className="mt-2 font-black text-slate-900">
                  {member.teaches.slice(0, 2).join(" & ") || "Skills being added"}
                </p>
              </div>

              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                <HeartHandshake className="h-4 w-4" />
              </div>

              <div className="rounded-2xl bg-blue-50 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-blue-500">
                  Wants to learn
                </p>
                <p className="mt-2 font-black text-slate-900">{member.learning.slice(0, 2).join(" & ") || "Skills being added"}</p>
              </div>
            </div>

            <Link href={`/profile/${member.id}`} className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-extrabold text-white transition hover:bg-blue-700">View profile</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Community({ members, loading }: { members: HomeMember[]; loading: boolean }) {
  const memberGridClass =
    members.length === 1
      ? "mx-auto max-w-sm grid-cols-1"
      : members.length === 2
        ? "mx-auto max-w-3xl sm:grid-cols-2"
        : members.length === 3
          ? "mx-auto max-w-6xl sm:grid-cols-2 lg:grid-cols-3"
          : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section id="community" className="bg-slate-50 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600">
              Community members
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.055em] text-slate-950 sm:text-4xl lg:text-5xl">
              Learn from people, not content libraries.
            </h2>

            <p className="mt-5 text-base font-medium leading-8 text-slate-600">
              Meet experienced people who are ready to teach, learn and
              contribute.
            </p>
          </div>

          <Link href="/discover" className="inline-flex w-fit items-center gap-2 text-sm font-extrabold text-blue-600">
            Browse all members
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label="Loading community members">
            {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-[400px] animate-pulse rounded-[28px] border border-slate-200 bg-white" />)}
          </div>
        ) : members.length === 0 ? (
          <div className="mt-12 rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <h3 className="text-xl font-black text-slate-950">No completed profiles yet</h3>
            <p className="mt-2 text-sm font-medium text-slate-500">Community members will appear here after completing their profiles.</p>
          </div>
        ) : (
          <div className={`mt-12 grid gap-5 ${memberGridClass}`}>
          {members.map((member, index) => (
            <motion.article
              key={member.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -7 }}
              className="flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)] transition-shadow hover:border-blue-200 hover:shadow-[0_25px_60px_rgba(37,99,235,0.1)]"
            >
              <div className="relative min-h-[228px] bg-gradient-to-br from-slate-50 to-blue-50 p-5">
                <div className="flex items-start justify-between">
                  <div className="relative">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="h-16 w-16 rounded-2xl object-cover ring-4 ring-white" />
                    ) : (
                      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-sm font-black text-white ring-4 ring-white">{initials(member.name)}</span>
                    )}
                  </div>

                  <span className="rounded-full border border-blue-100 bg-white px-2.5 py-1.5 text-[10px] font-extrabold text-blue-600">
                    {member.completedSwaps} {member.completedSwaps === 1 ? "swap" : "swaps"}
                  </span>
                </div>

                <div className="mt-5">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-black text-slate-950">
                      {member.name}
                    </h3>
                  </div>

                   <p className="mt-1 line-clamp-3 text-xs font-bold leading-5 text-slate-500">
                    {member.bio || "SkillSwap community member"}
                  </p>

                  <p className="mt-2 flex items-center gap-1 text-xs font-medium text-slate-400">
                    {member.location && <><MapPin className="h-3.5 w-3.5" />{member.location}</>}
                  </p>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-black text-slate-900">
                    {member.reviewCount > 0 ? member.rating.toFixed(1) : "New"}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({member.reviewCount} {member.reviewCount === 1 ? "review" : "reviews"})
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
                    {member.teaches.length === 0 && <span className="text-xs font-semibold text-slate-400">No teaching skills added</span>}
                  </div>
                </div>

                <Link href={`/profile/${member.id}`} className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-extrabold text-white transition hover:bg-blue-700">
                  View profile
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.article>
          ))}
          </div>
        )}
      </div>
    </section>
  );
}
