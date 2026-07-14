"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  MapPin,
  Star,
  Globe2,
  Clock,
  GraduationCap,
  BookOpen,
  HeartHandshake,
  Sparkles,
  Send,
  X,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

type Profile = {
  id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  languages: string[];
  availability: string[];
  rating: number;
  reviewCount: number;
  completedSwaps: number;
  trustScore: number;
  userSkills: { skill: { name: string }; type: string }[];
  reviewsReceived: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    reviewer: { name: string; avatar: string | null };
  }[];
  badges: { badge: { name: string; description: string; icon: string } }[];
};

export default function ProfilePage() {
  const params = useParams();
  const profileId = params.id as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [teachSkill, setTeachSkill] = useState("");
  const [learnSkill, setLearnSkill] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!profileId) return;
    fetch(`/api/profile/${profileId}`)
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [profileId]);

  const myTeachSkills = profile
    ? profile.userSkills.filter((s) => s.type === "teach").map((s) => s.skill.name)
    : [];
  const myLearnSkills = profile
    ? profile.userSkills.filter((s) => s.type === "learn").map((s) => s.skill.name)
    : [];

  const openSwapModal = () => {
    setShowSwapModal(true);
    setTeachSkill(myTeachSkills[0] || "");
    setLearnSkill(myLearnSkills[0] || "");
    setMessage("");
  };

  const sendRequest = async () => {
    if (!profile || !teachSkill || !learnSkill) return;
    setSending(true);
    try {
      const res = await fetch("/api/swap-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: profile.id,
          teachSkillName: teachSkill,
          learnSkillName: learnSkill,
          message,
        }),
      });
      if (res.ok) {
        setSent(true);
        setShowSwapModal(false);
      }
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-black text-slate-950">Profile not found</h1>
          <Link href="/discover" className="mt-4 inline-block text-sm font-bold text-blue-600 hover:underline">
            Back to Discover
          </Link>
        </div>
      </div>
    );
  }

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-5 py-5 sm:px-6 lg:px-8">
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Discover
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* Main */}
          <div>
            {/* Profile Card */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
              <div className="flex items-start gap-6">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="h-24 w-24 rounded-2xl object-cover" />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-600 text-3xl font-black text-white">
                    {initials}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-black text-slate-950">{profile.name}</h1>
                    <BadgeCheck className="h-6 w-6 fill-blue-600 text-white" />
                  </div>
                  {profile.location && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-500">
                      <MapPin className="h-4 w-4" /> {profile.location}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-4">
                    <span className="flex items-center gap-1 text-sm font-bold text-slate-700">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {profile.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-slate-500">{profile.reviewCount} reviews</span>
                    <span className="text-sm text-slate-500">{profile.completedSwaps} exchanges</span>
                  </div>
                </div>
              </div>

              {profile.bio && (
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <p className="text-sm font-medium leading-7 text-slate-600">{profile.bio}</p>
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <GraduationCap className="h-5 w-5" />
                    <h3 className="text-sm font-extrabold uppercase tracking-[0.12em]">Can Teach</h3>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {myTeachSkills.map((skill) => (
                      <span key={skill} className="rounded-xl bg-blue-50 px-3.5 py-2 text-sm font-bold text-blue-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <BookOpen className="h-5 w-5" />
                    <h3 className="text-sm font-extrabold uppercase tracking-[0.12em]">Wants to Learn</h3>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {myLearnSkills.map((skill) => (
                      <span key={skill} className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Languages & Availability */}
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Globe2 className="h-5 w-5" />
                  <h3 className="text-sm font-extrabold uppercase tracking-[0.12em]">Languages</h3>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.languages.map((lang) => (
                    <span key={lang} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="h-5 w-5" />
                  <h3 className="text-sm font-extrabold uppercase tracking-[0.12em]">Availability</h3>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.availability.map((time) => (
                    <span key={time} className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-600">
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-lg font-black text-slate-950">Reviews</h3>
              {profile.reviewsReceived.length === 0 ? (
                <p className="mt-4 text-sm font-medium text-slate-500">No reviews yet.</p>
              ) : (
                <div className="mt-5 space-y-4">
                  {profile.reviewsReceived.map((review) => (
                    <div key={review.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        {review.reviewer.avatar ? (
                          <img src={review.reviewer.avatar} alt="" className="h-9 w-9 rounded-xl object-cover" />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-xs font-black text-blue-600">
                            {review.reviewer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-black text-slate-900">{review.reviewer.name}</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="mt-3 text-sm font-medium text-slate-600">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <div className="sticky top-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              {sent ? (
                <div className="rounded-2xl bg-emerald-50 p-4 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <Send className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-extrabold text-emerald-600">Request Sent!</p>
                  <p className="mt-1 text-xs font-medium text-emerald-500">
                    Check your dashboard for updates.
                  </p>
                </div>
              ) : (
                <>
                  <button
                    onClick={openSwapModal}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                  >
                    <HeartHandshake className="h-4 w-4" />
                    Request Skill Swap
                  </button>
                  <Link
                    href="/dashboard"
                    className="mt-3 flex w-full items-center justify-center rounded-xl border border-slate-200 py-3.5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
                  >
                    View Dashboard
                  </Link>
                </>
              )}
            </div>

            {/* Badges */}
            {profile.badges.length > 0 && (
              <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 text-blue-600">
                  <ShieldCheck className="h-5 w-5" />
                  <h3 className="text-sm font-extrabold uppercase tracking-[0.12em]">Badges</h3>
                </div>
                <div className="mt-4 space-y-3">
                  {profile.badges.map((b) => (
                    <div key={b.badge.name} className="flex items-center gap-3 rounded-xl bg-blue-50 p-3">
                      <span className="text-xl">{b.badge.icon}</span>
                      <div>
                        <p className="text-xs font-extrabold text-blue-600">{b.badge.name}</p>
                        <p className="text-[11px] font-medium text-slate-500">{b.badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Swap Request Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-950">Request Skill Swap</h2>
              <button
                onClick={() => setShowSwapModal(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-2 text-sm font-medium text-slate-500">
              Send a swap request to <span className="font-bold text-slate-900">{profile.name}</span>
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">I will teach</label>
                <select
                  value={teachSkill}
                  onChange={(e) => setTeachSkill(e.target.value)}
                  className="mt-2 h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none"
                >
                  {myTeachSkills.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                  <HeartHandshake className="h-4 w-4" />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">I want to learn</label>
                <select
                  value={learnSkill}
                  onChange={(e) => setLearnSkill(e.target.value)}
                  className="mt-2 h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none"
                >
                  {myLearnSkills.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">Message (optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Introduce yourself..."
                  rows={3}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-900 outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowSwapModal(false)}
                className="flex-1 rounded-xl border border-slate-200 py-3.5 text-sm font-extrabold text-slate-700"
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
