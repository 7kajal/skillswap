"use client";

import RequestDialog from "@/component/requestDialog";
import axiosPrivate from "@/lib/axiosPrivate";
import {
  Award,
  BadgeCheck,
  BookOpen,
  Clock,
  Globe2,
  GraduationCap,
  HeartHandshake,
  Link2,
  MapPin,
  Pencil,
  Send,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { OwnProfileSummary, Profile } from "@/types/profile";
import { GitHubIcon } from "@/component/footer";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ProfilePage() {
  const params = useParams();
  const profileId = params.id as string;
  const { data: session, status } = useSession();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [ownProfile, setOwnProfile] = useState<OwnProfileSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [swapModal, setSwapModal] = useState<Profile | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!profileId) return;
    axiosPrivate
      .get(`/api/profile/${profileId}`)
      .then((response) => setProfile(response.data.data || null))
      .finally(() => setLoading(false));
  }, [profileId]);

  useEffect(() => {
    if (
      status !== "authenticated" ||
      !session?.user?.id ||
      session.user.id === profileId
    )
      return;
    axiosPrivate
      .get("/api/profile")
      .then((response) => setOwnProfile(response.data.data || null))
      .catch(() => setOwnProfile(null));
  }, [profileId, session?.user?.id, status]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-5 text-center">
        <div>
          <h1 className="text-2xl font-black text-slate-950">
            Profile not found
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            This member profile is unavailable.
          </p>
        </div>
      </div>
    );
  }

  const isOwnProfile = session?.user?.id === profileId;
  const teachingSkills = profile.userSkills
    .filter((item) => item.type === "teach")
    .map((item) => item.skill.name);
  const learningSkills = profile.userSkills
    .filter((item) => item.type === "learn")
    .map((item) => item.skill.name);

  const ownTeachingSkills = isOwnProfile
    ? teachingSkills
    : ownProfile?.userSkills
        .filter((item) => item.type === "teach")
        .map((item) => item.skill.name) || [];

  const hasSkills = teachingSkills.length > 0 || learningSkills.length > 0;

  const dialogUser = profile
    ? {
        ...profile,
        matchScore: 0,
        iCanTeachTheyWant: 0,
        theyCanTeachIWant: 0,
        totalSkillMatches: 0,
        skillsICanTeachThem: [],
        skillsTheyCanTeachMe: teachingSkills,
        reasons: [],
      }
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
          {/* Top Profile Header */}
          <div className="relative overflow-hidden bg-blue-50/45 px-5 py-6 sm:px-10 sm:py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                <div className="flex items-center gap-4 sm:block">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="h-20 w-20 shrink-0 rounded-2xl border-2 border-white object-cover shadow-md sm:h-28 sm:w-28 sm:rounded-[26px] sm:border-4 sm:shadow-lg"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-2 border-white bg-blue-600 text-2xl font-black text-white shadow-md sm:h-28 sm:w-28 sm:rounded-[26px] sm:border-4 sm:text-3xl sm:shadow-lg">
                      {getInitials(profile.name)}
                    </div>
                  )}

                  <div className="min-w-0 flex-1 sm:hidden">
                    <div className="flex items-center gap-1.5">
                      <h2 className="truncate text-xl font-black tracking-tight text-slate-950">
                        {profile.name}
                      </h2>
                      {profile.isProfileComplete && (
                        <BadgeCheck className="h-5 w-5 shrink-0 fill-blue-600 text-white" />
                      )}
                    </div>
                    {profile.location && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-slate-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />{" "}
                        <span className="truncate">{profile.location}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="hidden items-center gap-2 sm:flex">
                    <h2 className="text-2xl font-black tracking-[-0.04em] text-slate-950 sm:text-3xl">
                      {profile.name}
                    </h2>
                    {profile.isProfileComplete && (
                      <BadgeCheck className="h-5 w-5 shrink-0 fill-blue-600 text-white" />
                    )}
                  </div>
                  {profile.location && (
                    <p className="hidden items-center gap-1.5 text-sm font-medium text-slate-500 sm:mt-1.5 sm:flex">
                      <MapPin className="h-4 w-4 shrink-0" /> {profile.location}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:mt-3 sm:text-sm">
                    <span className="flex items-center gap-1 font-black text-slate-800">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {profile.rating.toFixed(1)}
                    </span>
                    <span className="text-slate-500">
                      {profile.reviewCount} reviews
                    </span>
                    <span className="text-slate-500">
                      {profile.completedSwaps} swaps
                    </span>
                    {profile.trustScore > 0 && (
                      <span className="flex items-center gap-1 font-bold text-emerald-600">
                        <ShieldCheck className="h-4 w-4" /> {profile.trustScore}
                        % trust
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button Container - Top Right on Large Screens */}
              <div className="w-full pt-1 sm:w-auto lg:w-auto lg:shrink-0 lg:pt-0">
                {isOwnProfile ? (
                  <Link
                    href="/profile/complete"
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-extrabold text-white shadow-lg shadow-blue-600/15 sm:w-auto"
                  >
                    <Pencil className="h-4 w-4" />
                    {profile.isProfileComplete
                      ? "Edit profile"
                      : "Complete profile"}
                  </Link>
                ) : (
                  <>
                    {sent ? (
                      <span className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-5 text-sm font-extrabold text-emerald-600 sm:w-auto">
                        <Send className="h-4 w-4" /> Request sent
                      </span>
                    ) : status !== "authenticated" ? (
                      <Link
                        href="/auth/login"
                        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-extrabold text-white sm:w-auto"
                      >
                        Log in to request a swap
                      </Link>
                    ) : !ownProfile?.isProfileComplete ||
                      ownTeachingSkills.length === 0 ? (
                      <Link
                        href={`/profile/${session?.user?.id}`}
                        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-extrabold text-white sm:w-auto"
                      >
                        Complete your profile
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSwapModal(profile)}
                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 sm:w-auto"
                      >
                        <HeartHandshake className="h-4 w-4" /> Request skill
                        swap
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {!profile.isProfileComplete && isOwnProfile && (
            <div className="flex flex-col justify-between gap-3 border-t border-blue-100 bg-blue-50 px-5 py-4 sm:flex-row sm:items-center sm:px-10 sm:py-5">
              <div>
                <p className="text-sm font-black text-blue-950 sm:text-base">
                  Your profile is not complete
                </p>
                <p className="mt-0.5 text-xs font-medium text-blue-700 sm:text-sm">
                  Add your skills and availability to appear in Discover.
                </p>
              </div>
              <Link
                href="/profile/complete"
                className="text-xs font-black text-blue-600 sm:text-sm"
              >
                Continue setup →
              </Link>
            </div>
          )}

          <div>
            <div className="px-5 py-6 sm:px-10 sm:py-8">
              {profile.bio && (
                <section className="pb-6 sm:pb-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.13em] text-slate-400 sm:text-sm">
                    About
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-slate-600 sm:mt-4 sm:text-base sm:leading-8">
                    {profile.bio}
                  </p>
                </section>
              )}

              {hasSkills && (
                <section className="border-t border-slate-100 py-6 sm:py-8">
                  <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
                    {teachingSkills.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-blue-600">
                          <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
                          <h3 className="text-xs font-black uppercase tracking-[0.12em] sm:text-sm">
                            Can teach
                          </h3>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
                          {teachingSkills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 sm:px-3.5 sm:py-2 sm:text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {learningSkills.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                          <h3 className="text-xs font-black uppercase tracking-[0.12em] sm:text-sm">
                            Wants to learn
                          </h3>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
                          {learningSkills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 sm:px-3.5 sm:py-2 sm:text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {(profile.languages.length > 0 ||
                profile.availability.length > 0) && (
                <section className="border-t border-slate-100 py-6 sm:py-8">
                  <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
                    {profile.languages.length > 0 && (
                      <div>
                        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                          <Globe2 className="h-4 w-4 shrink-0" /> Languages
                        </p>
                        <p className="mt-2 text-xs font-bold leading-6 text-slate-700 sm:mt-3 sm:text-sm">
                          {profile.languages.join(" · ")}
                        </p>
                      </div>
                    )}

                    {profile.availability.length > 0 && (
                      <div>
                        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                          <Clock className="h-4 w-4 shrink-0" /> Availability
                        </p>
                        <p className="mt-2 text-xs font-bold leading-6 text-slate-700 sm:mt-3 sm:text-sm">
                          {profile.availability.join(" · ")}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {profile.badges.length > 0 && (
                <section className="border-t border-slate-100 py-6 sm:py-8">
                  <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                    <Award className="h-4 w-4 shrink-0" /> Badges
                  </p>
                  <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-2 sm:gap-4">
                    {profile.badges.map(({ badge }) => (
                      <div
                        key={badge.name}
                        className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 sm:border-0 sm:p-0"
                      >
                        <span className="text-xl sm:text-base">
                          {badge.icon}
                        </span>
                        <div>
                          <p className="text-xs font-black text-slate-800 sm:text-sm">
                            {badge.name}
                          </p>
                          <p className="mt-0.5 text-xs leading-5 text-slate-500">
                            {badge.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {(profile.githubUrl ||
                profile.linkedinUrl ||
                profile.portfolioUrl) && (
                <div className="my-4 border-t border-slate-100 pt-6 sm:border-0 sm:pt-0">
                  <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                    <Link2 className="h-4 w-4 shrink-0" /> Links
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {profile.githubUrl && (
                      <a
                        href={profile.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
                      >
                        <GitHubIcon className="h-4 w-4 shrink-0" /> GitHub
                      </a>
                    )}

                    {profile.linkedinUrl && (
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
                      >
                        <Link2 className="h-4 w-4 shrink-0" /> LinkedIn
                      </a>
                    )}

                    {profile.portfolioUrl && (
                      <a
                        href={profile.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
                      >
                        <Globe2 className="h-4 w-4 shrink-0" /> Portfolio
                      </a>
                    )}
                  </div>
                </div>
              )}

              {profile.reviewsReceived.length > 0 && (
                <section className="border-t border-slate-100 pt-6 sm:pt-8">
                  <h3 className="text-base font-black text-slate-950 sm:text-lg">
                    Member reviews
                  </h3>
                  <div className="mt-4 divide-y divide-slate-100 sm:mt-5">
                    {profile.reviewsReceived.map((review) => (
                      <article
                        key={review.id}
                        className="py-4 first:pt-0 sm:py-5"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-700 sm:h-10 sm:w-10">
                              {getInitials(review.reviewer.name)}
                            </span>
                            <div>
                              <p className="text-xs font-black text-slate-900 sm:text-sm">
                                {review.reviewer.name}
                              </p>
                              <div className="mt-0.5 flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, index) => (
                                  <Star
                                    key={index}
                                    className={`h-3 w-3 ${
                                      index < review.rating
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-slate-200"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        {review.comment && (
                          <p className="mt-2.5 text-xs font-medium leading-6 text-slate-600 sm:mt-3 sm:text-sm">
                            {review.comment}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>

      <RequestDialog
        ownProfile={ownProfile}
        swapUser={swapModal ? dialogUser : null}
        onClose={() => setSwapModal(null)}
        onSuccess={() => setSent(true)}
      />
    </div>
  );
}
