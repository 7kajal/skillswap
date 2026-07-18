"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  BadgeCheck,
  HeartHandshake,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UsersRound,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import axiosPrivate from "@/lib/axiosPrivate";

type MatchReason = {
  type: "exact" | "related";
  from: string;
  to: string;
};

type ProfileSkill = { skill: { name: string }; type: string };

type MatchedUser = {
  id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  rating: number;
  reviewCount: number;
  completedSwaps: number;
  trustScore: number;
  matchScore: number;
  totalSkillMatches: number;
  skillsICanTeachThem: string[];
  skillsTheyCanTeachMe: string[];
  reasons: MatchReason[];
  userSkills: ProfileSkill[];
};

type OwnProfile = {
  isProfileComplete: boolean;
  userSkills: ProfileSkill[];
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function DiscoverPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<MatchedUser[]>([]);
  const [ownProfile, setOwnProfile] = useState<OwnProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [swapModal, setSwapModal] = useState<MatchedUser | null>(null);
  const [teachSkill, setTeachSkill] = useState("");
  const [learnSkill, setLearnSkill] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    const requests: Promise<unknown>[] = [axiosPrivate.get("/api/discover")];
    if (status === "authenticated") requests.push(axiosPrivate.get("/api/profile"));

    Promise.all(requests)
      .then(async (responses) => {
        const typedResponses = responses as { data: { data: unknown } }[];
        const discoverResponse = typedResponses[0];
        const profileResponse = typedResponses[1];
        setUsers(
          Array.isArray(discoverResponse.data.data) ? (discoverResponse.data.data as MatchedUser[]) : []
        );
        if (profileResponse?.data?.data) setOwnProfile(profileResponse.data.data as OwnProfile);
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
          item.skill.name.toLowerCase().includes(query)
        )
    );
  }, [search, users]);

  const ownTeachingSkills =
    ownProfile?.userSkills
      .filter((item) => item.type === "teach")
      .map((item) => item.skill.name) || [];

  const openSwapModal = (user: MatchedUser) => {
    const skillsTheyTeach = user.userSkills
      .filter((item) => item.type === "teach")
      .map((item) => item.skill.name);

    setSwapModal(user);
    setTeachSkill(user.skillsICanTeachThem[0] || ownTeachingSkills[0] || "");
    setLearnSkill(user.skillsTheyCanTeachMe[0] || skillsTheyTeach[0] || "");
    setMessage("");
    setError(null);
  };

  const sendRequest = async () => {
    if (!swapModal || !teachSkill || !learnSkill) return;
    setSending(true);
    setError(null);

    try {
      const response = await axiosPrivate.post("/api/swap-request", {
        receiverId: swapModal.id,
        teachSkillName: teachSkill,
        learnSkillName: learnSkill,
        message,
      });
      const result = response.data;

      if (result.success) {
        setSent((current) => [...current, swapModal.id]);
        setSwapModal(null);
      } else {
        setError(result.message || "Unable to send the request.");
      }
    } catch {
      setError("Unable to send the request. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 pb-5 pt-9 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl">
                  Discover people
                </h1>
                {status === "authenticated" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-600">
                    <Sparkles className="h-3 w-3" /> Match ranking
                  </span>
                )}
              </div>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-slate-500">
                Search the community by skill, person, or location. Open a profile
                to see their experience, reviews, and what they want to exchange.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
              <UsersRound className="h-4 w-4 text-blue-600" />
              {users.length} available member{users.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="relative mt-7">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search React, photography, Spanish, a name or location..."
              className="h-16 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-14 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
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
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-[28px] border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Search className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-xl font-black text-slate-950">
              {search ? `No results for “${search}”` : "No public profiles yet"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm font-medium text-slate-500">
              {search
                ? "Try another skill, name, or location."
                : "Completed member profiles will appear here."}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-500">
                {search
                  ? `${filteredUsers.length} result${filteredUsers.length === 1 ? "" : "s"}`
                  : "All members"}
              </p>
              {status === "authenticated" && users.some((user) => user.totalSkillMatches > 0) && (
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
                  ownTeachingSkills.length > 0;

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
                                <MapPin className="h-3.5 w-3.5" /> {user.location}
                              </p>
                            )}
                          </div>
                        </div>
                        {user.totalSkillMatches > 0 && (
                          <span className="shrink-0 rounded-full border border-blue-100 bg-white px-2.5 py-1.5 text-[10px] font-black text-blue-600 shadow-sm">
                            {user.totalSkillMatches} skill {user.totalSkillMatches === 1 ? "match" : "matches"}
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
                            <span key={skill} className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-600">
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
                            <span key={skill} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-600">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
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
                            href={session?.user?.id ? `/profile/${session.user.id}` : "/profile/complete"}
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
        )}
      </section>

      {swapModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-950">Request a skill swap</h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Propose a fair exchange with {swapModal.name}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSwapModal(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {swapModal.totalSkillMatches > 0 && (
              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-blue-50 p-4 text-sm font-bold text-blue-700">
                <Sparkles className="h-5 w-5" />
                {swapModal.totalSkillMatches} exact skill {swapModal.totalSkillMatches === 1 ? "match" : "matches"}
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-600">
                {error}
              </div>
            )}

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-black uppercase tracking-[0.13em] text-slate-400">
                  You will teach
                </label>
                <div className="mt-2">
                  <Select value={teachSkill} onValueChange={(v) => v && setTeachSkill(v)}>
                    <SelectTrigger className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none focus:border-blue-500">
                      <SelectValue placeholder="Select a skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {ownTeachingSkills.map((skill) => (
                        <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-[0.13em] text-slate-400">
                  You want to learn
                </label>
                <div className="mt-2">
                  <Select value={learnSkill} onValueChange={(v) => v && setLearnSkill(v)}>
                    <SelectTrigger className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none focus:border-blue-500">
                      <SelectValue placeholder="Select a skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {swapModal.userSkills
                        .filter((item) => item.type === "teach")
                        .map((item) => (
                          <SelectItem key={item.skill.name} value={item.skill.name}>{item.skill.name}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-[0.13em] text-slate-400">
                  Message <span className="normal-case tracking-normal">(optional)</span>
                </label>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={3}
                  placeholder="Introduce yourself and suggest what you could work on together..."
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-800 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setSwapModal(null)}
                className="h-12 flex-1 rounded-xl border border-slate-200 text-sm font-extrabold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={sendRequest}
                disabled={sending || !teachSkill || !learnSkill}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-extrabold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                <HeartHandshake className="h-4 w-4" />
                {sending ? "Sending..." : "Send request"}
              </button>
            </div>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5" /> You can manage this request in Swap center
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
