"use client";

import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Star,
  ArrowRight,
  Sparkles,
  X,
  Send,
  BadgeCheck,
  HeartHandshake,
  TrendingUp,
  Shield,
  Clock,
} from "lucide-react";
import Link from "next/link";

type MatchReason = {
  type: "exact" | "related";
  from: string;
  to: string;
};

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
  iCanTeachTheyWant: number;
  theyCanTeachIWant: number;
  reasons: MatchReason[];
  userSkills: { skill: { name: string }; type: string }[];
};

export default function DiscoverPage() {
  const [users, setUsers] = useState<MatchedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [swapModal, setSwapModal] = useState<MatchedUser | null>(null);
  const [teachSkill, setTeachSkill] = useState("");
  const [learnSkill, setLearnSkill] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [profileComplete, setProfileComplete] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/discover").then((r) => r.json()),
      fetch("/api/profile").then((r) => r.json()),
    ]).then(([discoverRes, profileRes]) => {
      setUsers(Array.isArray(discoverRes.data) ? discoverRes.data : []);
      setProfileComplete(
        profileRes.data?.bio && profileRes.data?.location && profileRes.data?.userSkills?.length > 0
      );
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.userSkills.some((s) => s.skill.name.toLowerCase().includes(q)) ||
      u.location?.toLowerCase().includes(q)
    );
  });

  const openSwapModal = (user: MatchedUser) => {
    setSwapModal(user);
    const mySkills = user.userSkills.filter((s) => s.type === "teach").map((s) => s.skill.name);
    const theirSkills = user.userSkills.filter((s) => s.type === "learn").map((s) => s.skill.name);
    setTeachSkill(mySkills[0] || "");
    setLearnSkill(theirSkills[0] || "");
    setMessage("");
  };

  const sendRequest = async () => {
    if (!swapModal || !teachSkill || !learnSkill) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/swap-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: swapModal.id,
          teachSkillName: teachSkill,
          learnSkillName: learnSkill,
          message,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSent((prev) => [...prev, swapModal.id]);
        setSwapModal(null);
      } else if (res.status === 409) {
        setError(json.message || "You already have a pending or accepted request with this user.");
      } else {
        setError(json.message || "Failed to send request. Please try again.");
      }
    } catch {
      setError("Failed to send request. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const myTeachSkills = swapModal
    ? swapModal.userSkills.filter((s) => s.type === "teach").map((s) => s.skill.name)
    : [];
  const theirLearnSkills = swapModal
    ? swapModal.userSkills.filter((s) => s.type === "learn").map((s) => s.skill.name)
    : [];

  return (
    <div className="bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-950">Discover</h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold text-blue-600">
                  <Sparkles className="h-3 w-3" />
                  AI Matching
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Smart semantic matching finds the best skill exchange partners for you
              </p>
            </div>
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
            >
              Dashboard
            </Link>
          </div>

          {/* Search */}
          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by skill, name, or location..."
              className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        {/* Profile Incomplete Banner */}
        {!profileComplete && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-amber-800">Complete your profile</h3>
                <p className="mt-1 text-sm font-medium text-amber-600">
                  Add your bio, location, and skills to get better matches.
                </p>
              </div>
              <Link
                href="/profile/complete"
                className="rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-amber-700"
              >
                Complete Profile
              </Link>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-black text-slate-950">No matches found</h3>
            <p className="mx-auto mt-2 max-w-md text-sm font-medium text-slate-500">
              Try adjusting your search or complete your profile to get better matches.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm font-bold text-slate-500">
              {filtered.length} match{filtered.length !== 1 ? "es" : ""} found with AI-powered scoring
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((user) => {
                const teachSkills = user.userSkills
                  .filter((s) => s.type === "teach")
                  .map((s) => s.skill.name);
                const learnSkills = user.userSkills
                  .filter((s) => s.type === "learn")
                  .map((s) => s.skill.name);
                const initials = user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <div
                    key={user.id}
                    className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.045)] transition-shadow hover:border-blue-200 hover:shadow-[0_25px_60px_rgba(37,99,235,0.1)]"
                  >
                    <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-16 w-16 rounded-2xl object-cover ring-4 ring-white"
                            />
                          ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black text-white ring-4 ring-white">
                              {initials}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-lg font-black text-slate-950">{user.name}</h3>
                              <BadgeCheck className="h-4 w-4 fill-blue-600 text-white" />
                            </div>
                            {user.location && (
                              <p className="mt-1 flex items-center gap-1 text-xs font-medium text-slate-400">
                                <MapPin className="h-3.5 w-3.5" />
                                {user.location}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1.5 text-[10px] font-extrabold text-blue-600">
                          <Sparkles className="h-3 w-3" />
                          {user.matchScore}% match
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-sm font-black text-slate-900">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          {user.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-slate-400">({user.reviewCount})</span>
                        {user.trustScore > 0 && (
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                            <Shield className="h-3.5 w-3.5" />
                            {user.trustScore}% trust
                          </span>
                        )}
                      </div>

                      {/* AI Match Reasons */}
                      {user.reasons.length > 0 && (
                        <div className="mt-4 rounded-xl bg-blue-50/50 p-3">
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-blue-500 mb-2">
                            Why you match
                          </p>
                          <div className="space-y-1.5">
                            {user.reasons.slice(0, 4).map((reason, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                {reason.type === "exact" ? (
                                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                    <span className="text-[8px] font-black">✓</span>
                                  </span>
                                ) : (
                                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                    <TrendingUp className="h-2.5 w-2.5" />
                                  </span>
                                )}
                                <span className="font-bold text-slate-700">{reason.from}</span>
                                <ArrowRight className="h-3 w-3 text-slate-300" />
                                <span className="font-bold text-blue-600">{reason.to}</span>
                                {reason.type === "exact" && (
                                  <span className="text-[9px] font-extrabold text-emerald-500">exact</span>
                                )}
                                {reason.type === "related" && (
                                  <span className="text-[9px] font-extrabold text-blue-400">related</span>
                                )}
                              </div>
                            ))}
                            {user.reasons.length > 4 && (
                              <p className="text-[10px] font-bold text-slate-400">
                                +{user.reasons.length - 4} more match{user.reasons.length - 4 !== 1 ? "es" : ""}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 space-y-3">
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                            Can teach you
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {learnSkills.slice(0, 3).map((skill) => (
                              <span
                                key={skill}
                                className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-600"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                            Wants to learn
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {teachSkills.slice(0, 3).map((skill) => (
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

                      {sent.includes(user.id) ? (
                        <div className="mt-5 flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-50 text-sm font-extrabold text-emerald-600">
                          Request Sent
                        </div>
                      ) : (
                        <button
                          onClick={() => openSwapModal(user)}
                          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-extrabold text-white transition hover:bg-blue-700"
                        >
                          <HeartHandshake className="h-4 w-4" />
                          Request Skill Swap
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Swap Request Modal */}
      {swapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-950">Request Skill Swap</h2>
              <button
                onClick={() => setSwapModal(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-2 text-sm font-medium text-slate-500">
              Send a swap request to <span className="font-bold text-slate-900">{swapModal.name}</span>
            </p>

            {swapModal.reasons.length > 0 && (
              <div className="mt-4 rounded-xl bg-blue-50 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-blue-500 mb-2">
                  AI Match Analysis
                </p>
                <div className="space-y-1">
                  {swapModal.reasons.slice(0, 3).map((reason, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <span className={`flex h-4 w-4 items-center justify-center rounded-full ${
                        reason.type === "exact" ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                      }`}>
                        <span className="text-[8px] font-black">
                          {reason.type === "exact" ? "✓" : "~"}
                        </span>
                      </span>
                      <span className="font-bold text-slate-700">{reason.from}</span>
                      <ArrowRight className="h-3 w-3 text-slate-300" />
                      <span className="font-bold text-blue-600">{reason.to}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 space-y-4">
              {error && (
                <div className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">
                  {error}
                </div>
              )}
              <div>
                <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  I will teach
                </label>
                <select
                  value={teachSkill}
                  onChange={(e) => setTeachSkill(e.target.value)}
                  className="mt-2 h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none"
                >
                  {myTeachSkills.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                  {myTeachSkills.length === 0 && <option value="">Select a skill you can teach</option>}
                </select>
              </div>

              <div className="flex justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                  <HeartHandshake className="h-4 w-4" />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  I want to learn
                </label>
                <select
                  value={learnSkill}
                  onChange={(e) => setLearnSkill(e.target.value)}
                  className="mt-2 h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none"
                >
                  {theirLearnSkills.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                  {theirLearnSkills.length === 0 && <option value="">Select a skill to learn</option>}
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Message (optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Introduce yourself and suggest how you'd like to exchange..."
                  rows={3}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-900 outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSwapModal(null)}
                className="flex-1 rounded-xl border border-slate-200 py-3.5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={sendRequest}
                disabled={sending || !teachSkill || !learnSkill}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Request"}
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
