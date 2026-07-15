"use client";

import { useEffect, useState } from "react";
import {
  Star,
  Shield,
  ArrowLeft,
  BadgeCheck,
  GitBranch,
  Globe2,
  Link2,
  Award,
  TrendingUp,
  Check,
  Edit3,
  Save,
} from "lucide-react";
import Link from "next/link";

type ReputationData = {
  rating: number;
  reviewCount: number;
  trustScore: number;
  completedSwaps: number;
  totalHoursShared: number;
  verifiedSkills: string[];
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    reviewer: { name: string; avatar: string | null };
    createdAt: string;
  }[];
  badges: { name: string; icon: string; description: string }[];
  socialLinks: {
    github: string | null;
    portfolio: string | null;
    linkedin: string | null;
  };
};

export default function ReputationPage() {
  const [data, setData] = useState<ReputationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingLinks, setEditingLinks] = useState(false);
  const [links, setLinks] = useState({ githubUrl: "", portfolioUrl: "", linkedinUrl: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/reputation")
      .then((r) => r.json())
      .then((json) => {
        if (json.data) {
          setData(json.data);
          setLinks({
            githubUrl: json.data.socialLinks.github || "",
            portfolioUrl: json.data.socialLinks.portfolio || "",
            linkedinUrl: json.data.socialLinks.linkedin || "",
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const saveLinks = async () => {
    setSaving(true);
    await fetch("/api/reputation", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateLinks", links }),
    });
    setData((prev) =>
      prev
        ? {
            ...prev,
            socialLinks: {
              github: links.githubUrl || null,
              portfolio: links.portfolioUrl || null,
              linkedin: links.linkedinUrl || null,
            },
          }
        : prev
    );
    setEditingLinks(false);
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!data) return null;

  const trustColor =
    data.trustScore >= 80
      ? "text-emerald-600"
      : data.trustScore >= 50
      ? "text-amber-600"
      : "text-slate-500";
  const trustBg =
    data.trustScore >= 80
      ? "bg-emerald-50"
      : data.trustScore >= 50
      ? "bg-amber-50"
      : "bg-slate-50";

  return (
    <div className="bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-5 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-950">Reputation & Verification</h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Your trust profile and verified credentials
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Trust Score Card */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-950">Trust Score</h2>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    Based on reviews, completed swaps, and verifications
                  </p>
                </div>
                <div className={`flex h-20 w-20 items-center justify-center rounded-2xl ${trustBg}`}>
                  <span className={`text-2xl font-black ${trustColor}`}>{data.trustScore}%</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-4 gap-4">
                <div className="rounded-xl bg-slate-50 p-4 text-center">
                  <Star className="mx-auto h-5 w-5 fill-amber-400 text-amber-400" />
                  <p className="mt-2 text-xl font-black text-slate-950">{data.rating.toFixed(1)}</p>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Rating</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 text-center">
                  <Shield className="mx-auto h-5 w-5 text-blue-600" />
                  <p className="mt-2 text-xl font-black text-slate-950">{data.reviewCount}</p>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Reviews</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 text-center">
                  <BadgeCheck className="mx-auto h-5 w-5 text-emerald-600" />
                  <p className="mt-2 text-xl font-black text-slate-950">{data.completedSwaps}</p>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Swaps</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 text-center">
                  <TrendingUp className="mx-auto h-5 w-5 text-violet-600" />
                  <p className="mt-2 text-xl font-black text-slate-950">{data.totalHoursShared}h</p>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Hours</p>
                </div>
              </div>

              {/* Trust Score Bar */}
              <div className="mt-6">
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${data.trustScore}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[10px] font-extrabold text-slate-400">
                  <span>Newcomer</span>
                  <span>Trusted</span>
                  <span>Expert</span>
                </div>
              </div>
            </div>

            {/* Verified Skills */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">Verified Skills</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Skills that have been verified through completed exchanges
              </p>

              {data.verifiedSkills.length === 0 ? (
                <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <Award className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-2 text-sm font-bold text-slate-400">
                    No verified skills yet. Complete swaps to earn verified badges.
                  </p>
                </div>
              ) : (
                <div className="mt-4 flex flex-wrap gap-2">
                  {data.verifiedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-600"
                    >
                      <Check className="h-4 w-4" />
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">Reviews</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                What others say about exchanging skills with you
              </p>

              {data.reviews.length === 0 ? (
                <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <Star className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-2 text-sm font-bold text-slate-400">No reviews yet</p>
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {data.reviews.map((review) => (
                    <div key={review.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xs font-black text-white">
                            {review.reviewer.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{review.reviewer.name}</p>
                            <p className="text-[10px] font-bold text-slate-400">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="mt-3 text-sm text-slate-600">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">Badges</h2>
              {data.badges.length === 0 ? (
                <p className="mt-3 text-sm font-medium text-slate-400">No badges earned yet</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {data.badges.map((badge) => (
                    <div key={badge.name} className="flex items-center gap-3 rounded-xl bg-blue-50 p-3">
                      <span className="text-xl">{badge.icon}</span>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{badge.name}</p>
                        <p className="text-[10px] font-medium text-slate-500">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-950">Links</h2>
                {!editingLinks ? (
                  <button
                    onClick={() => setEditingLinks(true)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={saveLinks}
                    disabled={saving}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-extrabold text-white transition hover:bg-blue-700"
                  >
                    <Save className="h-3 w-3" />
                    {saving ? "Saving..." : "Save"}
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-3">
                {editingLinks ? (
                  <>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                        <GitBranch className="h-3.5 w-3.5" /> GitHub
                      </label>
                      <input
                        value={links.githubUrl}
                        onChange={(e) => setLinks((p) => ({ ...p, githubUrl: e.target.value }))}
                        placeholder="https://github.com/username"
                        className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                        <Globe2 className="h-3.5 w-3.5" /> Portfolio
                      </label>
                      <input
                        value={links.portfolioUrl}
                        onChange={(e) => setLinks((p) => ({ ...p, portfolioUrl: e.target.value }))}
                        placeholder="https://yoursite.com"
                        className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                        <Link2 className="h-3.5 w-3.5" /> LinkedIn
                      </label>
                      <input
                        value={links.linkedinUrl}
                        onChange={(e) => setLinks((p) => ({ ...p, linkedinUrl: e.target.value }))}
                        placeholder="https://linkedin.com/in/username"
                        className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 outline-none"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {data.socialLinks.github ? (
                      <a href={data.socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline">
                        <GitBranch className="h-4 w-4" /> GitHub Profile
                      </a>
                    ) : (
                      <p className="text-sm text-slate-400">No GitHub linked</p>
                    )}
                    {data.socialLinks.portfolio ? (
                      <a href={data.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline">
                        <Globe2 className="h-4 w-4" /> Portfolio
                      </a>
                    ) : (
                      <p className="text-sm text-slate-400">No portfolio linked</p>
                    )}
                    {data.socialLinks.linkedin ? (
                      <a href={data.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline">
                        <Link2 className="h-4 w-4" /> LinkedIn Profile
                      </a>
                    ) : (
                      <p className="text-sm text-slate-400">No LinkedIn linked</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
