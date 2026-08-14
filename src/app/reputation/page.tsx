"use client";

import { useEffect, useState } from "react";
import {
  Star,
  Shield,
  BadgeCheck,
  GitBranch,
  Globe2,
  Link2,
  TrendingUp,
  Check,
  Edit3,
  Save,
  RefreshCw,
  Award,
  MessageSquare,
} from "lucide-react";
import axiosPrivate from "@/lib/axiosPrivate";
import type { ReputationData } from "@/types/reputation";

export default function ReputationPage() {
  const [data, setData] = useState<ReputationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "links">(
    "overview",
  );
  const [editingLinks, setEditingLinks] = useState(false);
  const [links, setLinks] = useState({
    githubUrl: "",
    portfolioUrl: "",
    linkedinUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReputation = async () => {
    try {
      const res = await axiosPrivate.get("/api/reputation");
      if (res.data.data) {
        setData(res.data.data);
        setLinks({
          githubUrl: res.data.data.socialLinks.github || "",
          portfolioUrl: res.data.data.socialLinks.portfolio || "",
          linkedinUrl: res.data.data.socialLinks.linkedin || "",
        });
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchReputation().finally(() => setLoading(false));

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchReputation();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const saveLinks = async () => {
    setSaving(true);
    await axiosPrivate.put("/api/reputation", { action: "updateLinks", links });
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
        : prev,
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
    <div className="min-h-screen  pb-16">
      {/* Top Banner Header */}
      <div className=" border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-5 pt-9 pb-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">
                Reputation & Verification
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Your trust profile and verified credentials
              </p>
            </div>
            <button
              onClick={async () => {
                setRefreshing(true);
                await fetchReputation();
                setRefreshing(false);
              }}
              disabled={refreshing}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {/* Trust Score Banner Card */}
          <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="flex w-full flex-col items-start gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-5">
                <div
                  className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl ${trustBg}`}
                >
                  <span className={`text-2xl font-black ${trustColor}`}>
                    {data.trustScore}%
                  </span>
                </div>
                <div className="w-full sm:w-auto">
                  <h2 className="text-xl font-black text-slate-950">
                    Trust Score
                  </h2>
                  <p className="mt-0.5 text-sm font-medium text-slate-500">
                    Based on reviews, completed swaps, and verifications
                  </p>
                  <div className="mt-3 h-2.5 w-full max-w-60 overflow-hidden rounded-full bg-slate-100 sm:w-64">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${data.trustScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Stats Highlights Bar */}
              <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 md:w-auto">
                <div className="rounded-xl bg-slate-50 p-3.5 text-center sm:w-24">
                  <Star className="mx-auto h-5 w-5 fill-amber-400 text-amber-400" />
                  <p className="mt-1.5 text-lg font-black text-slate-950">
                    {data.rating.toFixed(1)}
                  </p>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Rating
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3.5 text-center sm:w-24">
                  <Shield className="mx-auto h-5 w-5 text-blue-600" />
                  <p className="mt-1.5 text-lg font-black text-slate-950">
                    {data.reviewCount}
                  </p>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Reviews
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3.5 text-center sm:w-24">
                  <BadgeCheck className="mx-auto h-5 w-5 text-emerald-600" />
                  <p className="mt-1.5 text-lg font-black text-slate-950">
                    {data.completedSwaps}
                  </p>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Swaps
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3.5 text-center sm:w-24">
                  <TrendingUp className="mx-auto h-5 w-5 text-violet-600" />
                  <p className="mt-1.5 text-lg font-black text-slate-950">
                    {data.totalHoursShared}h
                  </p>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Hours
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-8 flex gap-2 overflow-x-auto border-b border-slate-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-extrabold transition ${
                activeTab === "overview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Award className="h-4 w-4" /> Overview &amp; Skills
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-extrabold transition ${
                activeTab === "reviews"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <MessageSquare className="h-4 w-4" /> Reviews (
              {data.reviews.length})
            </button>
            <button
              onClick={() => setActiveTab("links")}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-extrabold transition ${
                activeTab === "links"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Globe2 className="h-4 w-4" /> Links
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 lg:px-8">
        {/* TAB 1: OVERVIEW & SKILLS */}
        {activeTab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
            {/* Verified Skills */}
            <div className="rounded-[28px] border border-slate-200  p-8 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">
                Verified Skills
              </h2>
              {/* <p className="mt-1 text-sm font-medium text-slate-500">
                Skills that have been verified through completed exchanges
              </p> */}

              {data.verifiedSkills.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
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
              ) : (
                <p className="mt-4 text-sm font-medium text-slate-400">
                  No verified skills yet.
                </p>
              )}
            </div>

            {/* Badges */}
            <div>
              {data.badges.length > 0 ? (
                <div
                  className="rounded-[28px] border border-slate-200 bg-white p-8
                 shadow-sm"
                >
                  <h2 className="text-lg font-black text-slate-950">Badges</h2>
                  <div className="mt-4 space-y-3">
                    {data.badges.map((badge) => (
                      <div
                        key={badge.name}
                        className="flex items-center gap-3 rounded-xl bg-blue-50 p-3"
                      >
                        <span className="text-xl">{badge.icon}</span>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {badge.name}
                          </p>
                          <p className="text-[10px] font-medium text-slate-500">
                            {badge.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
                  <h2 className="text-lg font-black text-slate-950">Badges</h2>
                  <p className="mt-2 text-sm font-medium text-slate-400">
                    No badges earned yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: REVIEWS */}
        {activeTab === "reviews" && (
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">Reviews</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              What others say about exchanging skills with you
            </p>

            {data.reviews.length > 0 ? (
              <div className="mt-6 space-y-4">
                {data.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xs font-black text-white">
                          {review.reviewer.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {review.reviewer.name}
                          </p>
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
                      <p className="mt-3 text-sm text-slate-600">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm font-medium text-slate-400">
                No reviews received yet.
              </p>
            )}
          </div>
        )}

        {/* TAB 3: SOCIAL LINKS */}
        {activeTab === "links" && (
          <div className="max-w-xl rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
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
                      onChange={(e) =>
                        setLinks((p) => ({ ...p, githubUrl: e.target.value }))
                      }
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
                      onChange={(e) =>
                        setLinks((p) => ({
                          ...p,
                          portfolioUrl: e.target.value,
                        }))
                      }
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
                      onChange={(e) =>
                        setLinks((p) => ({ ...p, linkedinUrl: e.target.value }))
                      }
                      placeholder="https://linkedin.com/in/username"
                      className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 outline-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  {data.socialLinks.github && (
                    <a
                      href={data.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
                    >
                      <GitBranch className="h-4 w-4" /> GitHub Profile
                    </a>
                  )}
                  {data.socialLinks.portfolio && (
                    <a
                      href={data.socialLinks.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
                    >
                      <Globe2 className="h-4 w-4" /> Portfolio
                    </a>
                  )}
                  {data.socialLinks.linkedin && (
                    <a
                      href={data.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
                    >
                      <Link2 className="h-4 w-4" /> LinkedIn Profile
                    </a>
                  )}
                  {!data.socialLinks.github &&
                    !data.socialLinks.portfolio &&
                    !data.socialLinks.linkedin && (
                      <button
                        onClick={() => setEditingLinks(true)}
                        className="text-sm font-bold text-blue-600"
                      >
                        Add professional links
                      </button>
                    )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
