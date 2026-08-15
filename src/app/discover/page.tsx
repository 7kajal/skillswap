"use client";

import RequestDialog from "@/component/requestDialog";
import axiosPrivate from "@/lib/axiosPrivate";
import {
  ArrowRight,
  BadgeCheck,
  HeartHandshake,
  Lock,
  MapPin,
  Search,
  Star,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import type { MatchedUser, OwnProfile } from "@/types/discover";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function DiscoverContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<MatchedUser[]>([]);
  const [ownProfile, setOwnProfile] = useState<OwnProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [swapModal, setSwapModal] = useState<MatchedUser | null>(null);
  const [sent, setSent] = useState<string[]>([]);

  useEffect(() => {
    const query = searchParams.get("search") || searchParams.get("skill") || "";
    if (query) {
      setSearch(query);
    }
  }, [searchParams]);

  useEffect(() => {
    if (status === "loading") return;

    const requests: Promise<unknown>[] = [axiosPrivate.get("/api/discover")];
    if (status === "authenticated")
      requests.push(axiosPrivate.get("/api/profile"));

    Promise.all(requests)
      .then(async (responses) => {
        const typedResponses = responses as { data: { data: unknown } }[];
        const discoverResponse = typedResponses[0];
        const profileResponse = typedResponses[1];
        setUsers(
          Array.isArray(discoverResponse.data.data)
            ? (discoverResponse.data.data as MatchedUser[])
            : [],
        );
        if (profileResponse?.data?.data)
          setOwnProfile(profileResponse.data.data as OwnProfile);
      })
      .finally(() => setLoading(false));
  }, [status]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.location?.toLowerCase().includes(query) ||
        user.bio?.toLowerCase().includes(query) ||
        user.userSkills.some((item) =>
          item.skill.name.toLowerCase().includes(query),
        ),
    );
  }, [search, users]);

  const ownTeachingSkills =
    ownProfile?.userSkills
      .filter((item) => item.type === "teach")
      .map((item) => item.skill.name) || [];

  const openSwapModal = (user: MatchedUser) => {
    setSwapModal(user);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 pb-5 pt-9 sm:px-6 lg:px-8">
          <div className="mt-8 flex flex-col ">
            <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-blue-600 animate-fade-in">
              SKILL MATCH
            </div>
            <h1 className="text-3xl font-black tracking-[-0.055em] text-slate-950 sm:text-4xl lg:text-5xl">
              Discover people
            </h1>
            <p className="mt-3 max-w-xl text-base font-semibold leading-7 text-slate-500">
              Search the community by skill, person, or location. Open a profile
              to see their experience, reviews, and what they want to exchange.
            </p>
          </div>

          <div className="relative mt-7">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search React, photography, Spanish, a name or location..."
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-5 text-sm font-semibold text-slate-900 shadow-xs outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:h-16"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-9 sm:px-6 lg:px-8">
        {status === "unauthenticated" ? (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Lock className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-xl font-black text-slate-950">
              Login to see match profiles
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm font-medium text-slate-500">
              Sign in to discover people whose skills complement yours and
              connect with the community.
            </p>
            <Link
              href="/auth/login"
              className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-extrabold text-white transition hover:bg-blue-700"
            >
              Login to get started
            </Link>
          </div>
        ) : loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-[28px] border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : filteredUsers.length > 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-500">
                {search
                  ? `${filteredUsers.length} result${filteredUsers.length === 1 ? "" : "s"}`
                  : "All members"}
              </p>
              {status === "authenticated" &&
                users.some((user) => user.totalSkillMatches > 0) && (
                  <p className="text-xs font-bold text-blue-600">
                    Best skill matches appear first
                  </p>
                )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user) => {
                const teachingSkills = user.userSkills
                  .filter((item) => item.type === "teach")
                  .map((item) => item.skill.name);
                const learningSkills = user.userSkills
                  .filter((item) => item.type === "learn")
                  .map((item) => item.skill.name);
                const canRequest =
                  status === "authenticated" &&
                  ownProfile?.isProfileComplete &&
                  (ownTeachingSkills.length > 0 || (user.swapCount && user.swapCount > 0));

                return (
                  <article
                    key={user.id}
                    className="group flex flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.045)] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_55px_rgba(37,99,235,0.1)]"
                  >
                    <div className="relative bg-linear-to-br from-slate-50 to-blue-50 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-4">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-4 ring-white"
                            />
                          ) : (
                            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black text-white ring-4 ring-white">
                              {getInitials(user.name)}
                            </span>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h2 className="truncate text-lg font-black text-slate-950">
                                {user.name}
                              </h2>
                              <BadgeCheck className="h-4 w-4 shrink-0 fill-blue-600 text-white" />
                            </div>
                            {user.location && (
                              <p className="mt-1 flex items-center gap-1 truncate text-xs font-medium text-slate-400">
                                <MapPin className="h-3.5 w-3.5" />{" "}
                                {user.location}
                              </p>
                            )}
                          </div>
                        </div>
                        {user.totalSkillMatches > 0 && (
                          <span className="shrink-0 rounded-full border border-blue-100 bg-white px-2.5 py-1.5 text-[10px] font-black text-blue-600 shadow-sm">
                            {user.totalSkillMatches} skill{" "}
                            {user.totalSkillMatches === 1 ? "match" : "matches"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1 font-black text-slate-800">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          {user.rating.toFixed(1)}
                        </span>
                        <span>{user.reviewCount} reviews</span>
                        <span>{user.completedSwaps} swaps</span>
                      </div>

                      {user.bio && (
                        <p className="mt-4 line-clamp-2 text-sm font-medium leading-6 text-slate-500">
                          {user.bio}
                        </p>
                      )}

                      <div className="mt-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-blue-500">
                          Can teach you
                        </p>
                        <div className="mt-2 flex min-h-8 flex-wrap gap-1.5">
                          {teachingSkills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-600"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                          Wants to learn
                        </p>
                        <div className="mt-2 flex min-h-8 flex-wrap gap-1.5">
                          {learningSkills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-600"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-auto grid gap-2 pt-6 min-[390px]:grid-cols-2">
                        <Link
                          href={`/profile/${user.id}`}
                          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-extrabold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
                        >
                          View profile <ArrowRight className="h-4 w-4" />
                        </Link>

                        {sent.includes(user.id) ? (
                          <span className="inline-flex h-12 items-center justify-center rounded-xl bg-emerald-50 text-sm font-extrabold text-emerald-600">
                            Request sent
                          </span>
                        ) : status !== "authenticated" ? (
                          <Link
                            href="/auth/login"
                            className="inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 text-sm font-extrabold text-white transition hover:bg-blue-700"
                          >
                            Request swap
                          </Link>
                        ) : !canRequest ? (
                          <Link
                            href={
                              session?.user?.id
                                ? `/profile/${session.user.id}`
                                : "/profile/complete"
                            }
                            className="inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-3 text-center text-xs font-extrabold text-white transition hover:bg-blue-700"
                          >
                            Complete profile
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openSwapModal(user)}
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-extrabold text-white transition hover:bg-blue-700"
                          >
                            <HeartHandshake className="h-4 w-4" /> Request swap
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        ) : null}
      </section>

      {swapModal && (
        <RequestDialog
          ownProfile={ownProfile}
          swapUser={swapModal}
          onClose={() => setSwapModal(null)}
          onSuccess={(receiverId) =>
            setSent((current) => [...current, receiverId])
          }
        />
      )}
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      }
    >
      <DiscoverContent />
    </Suspense>
  );
}
