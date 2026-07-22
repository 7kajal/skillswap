"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Award,
  BadgeCheck,
  BookOpen,
  Clock,
  Globe2,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Pencil,
  Send,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";
import Link from "next/link";
import axiosPrivate from "@/lib/axiosPrivate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProfileSkill = { skill: { name: string }; type: string };

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
  isProfileComplete: boolean;
  userSkills: ProfileSkill[];
  reviewsReceived: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    reviewer: { name: string; avatar: string | null };
  }[];
  badges: { badge: { name: string; description: string; icon: string } }[];
};

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
  const [ownProfile, setOwnProfile] = useState<
    Pick<Profile, "isProfileComplete" | "userSkills"> | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [teachSkill, setTeachSkill] = useState("");
  const [learnSkill, setLearnSkill] = useState("");
  const [message, setMessage] = useState("");
  const [requestError, setRequestError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!profileId) return;
    axiosPrivate.get(`/api/profile/${profileId}`)
      .then((response) => setProfile(response.data.data || null))
      .finally(() => setLoading(false));
  }, [profileId]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id || session.user.id === profileId) return;
    axiosPrivate.get("/api/profile")
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
          <h1 className="text-2xl font-black text-slate-950">Profile not found</h1>
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

  const openSwapModal = () => {
    setTeachSkill(ownTeachingSkills[0] || "");
    setLearnSkill(teachingSkills[0] || "");
    setMessage("");
    setRequestError("");
    setShowSwapModal(true);
  };

  const sendRequest = async () => {
    if (!teachSkill || !learnSkill) return;
    setSending(true);
    setRequestError("");
    try {
      const response = await axiosPrivate.post("/api/swap-request", {
        receiverId: profile.id,
        teachSkillName: teachSkill,
        learnSkillName: learnSkill,
        message,
      });
      const result = response.data;
      if (!result.success) {
        setRequestError(result.message || "Unable to send the request.");
        return;
      }
      setSent(true);
      setShowSwapModal(false);
    } catch {
      setRequestError("Unable to send the request. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
          <div className="relative overflow-hidden bg-blue-50/45 px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="h-28 w-28 rounded-[26px] border-4 border-white object-cover shadow-lg"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-[26px] border-4 border-white bg-blue-600 text-3xl font-black text-white shadow-lg">
                    {getInitials(profile.name)}
                  </div>
                )}

                <div className="pb-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950">
                      {profile.name}
                    </h2>
                    {profile.isProfileComplete && (
                      <BadgeCheck className="h-5 w-5 fill-blue-600 text-white" />
                    )}
                  </div>
                  {profile.location && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-500">
                      <MapPin className="h-4 w-4" /> {profile.location}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                    <span className="flex items-center gap-1 font-black text-slate-800">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {profile.rating.toFixed(1)}
                    </span>
                    <span className="text-slate-500">{profile.reviewCount} reviews</span>
                    <span className="text-slate-500">{profile.completedSwaps} swaps</span>
                    {profile.trustScore > 0 && (
                      <span className="flex items-center gap-1 font-bold text-emerald-600">
                        <ShieldCheck className="h-4 w-4" /> {profile.trustScore}% trust
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="sm:pb-1">
                {isOwnProfile ? (
                  <Link
                    href="/profile/complete"
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-extrabold text-white shadow-lg shadow-blue-600/15"
                  >
                    <Pencil className="h-4 w-4" />
                    {profile.isProfileComplete ? "Edit profile" : "Complete profile"}
                  </Link>
                ) : (
                  <>
                  {sent ? (
                    <span className="inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-50 px-5 text-sm font-extrabold text-emerald-600">
                      <Send className="h-4 w-4" /> Request sent
                    </span>
                  ) : status !== "authenticated" ? (
                    <Link href="/auth/login" className="inline-flex h-12 items-center rounded-xl bg-blue-600 px-6 text-sm font-extrabold text-white">
                      Log in to request a swap
                    </Link>
                  ) : !ownProfile?.isProfileComplete || ownTeachingSkills.length === 0 ? (
                    <Link href={`/profile/${session?.user?.id}`} className="inline-flex h-12 items-center rounded-xl bg-blue-600 px-6 text-sm font-extrabold text-white">
                      Complete your profile
                    </Link>
                  ) : (
                    <button type="button" onClick={openSwapModal} className="inline-flex h-12 items-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20">
                      <HeartHandshake className="h-4 w-4" /> Request skill swap
                    </button>
                  )}
                  </>
                )}
              </div>
            </div>
          </div>

          {!profile.isProfileComplete && isOwnProfile && (
            <div className="flex flex-col justify-between gap-4 border-t border-blue-100 bg-blue-50 px-6 py-5 sm:flex-row sm:items-center sm:px-10">
              <div>
                <p className="font-black text-blue-950">Your profile is not complete</p>
                <p className="mt-1 text-sm font-medium text-blue-700">
                  Add your skills and availability to appear in Discover.
                </p>
              </div>
              <Link href="/profile/complete" className="text-sm font-black text-blue-600">
                Continue setup →
              </Link>
            </div>
          )}

          <div>
            <div className="px-6 py-8 sm:px-10">
              {profile.bio && (
                <section className="pb-8">
                  <h3 className="text-sm font-black uppercase tracking-[0.13em] text-slate-400">About</h3>
                  <p className="mt-4 max-w-2xl text-base font-medium leading-8 text-slate-600">{profile.bio}</p>
                </section>
              )}

              {hasSkills && (
                <section className="border-t border-slate-100 py-8">
                  <div className="grid gap-8 sm:grid-cols-2">
                    {teachingSkills.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-blue-600">
                          <GraduationCap className="h-5 w-5" />
                          <h3 className="text-sm font-black uppercase tracking-[0.12em]">Can teach</h3>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {teachingSkills.map((skill) => (
                            <span key={skill} className="rounded-full bg-blue-50 px-3.5 py-2 text-sm font-bold text-blue-600">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {learningSkills.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <BookOpen className="h-5 w-5" />
                          <h3 className="text-sm font-black uppercase tracking-[0.12em]">Wants to learn</h3>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {learningSkills.map((skill) => (
                            <span key={skill} className="rounded-full border border-slate-200 px-3.5 py-2 text-sm font-bold text-slate-600">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {(profile.languages.length > 0 || profile.availability.length > 0) && (
                <section className="border-t border-slate-100 py-8">
                  <div className="grid gap-8 sm:grid-cols-2">
                    {profile.languages.length > 0 && (
                      <div>
                        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                          <Globe2 className="h-4 w-4" /> Languages
                        </p>
                        <p className="mt-3 text-sm font-bold leading-6 text-slate-700">
                          {profile.languages.join(" · ")}
                        </p>
                      </div>
                    )}

                    {profile.availability.length > 0 && (
                      <div>
                        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                          <Clock className="h-4 w-4" /> Availability
                        </p>
                        <p className="mt-3 text-sm font-bold leading-6 text-slate-700">
                          {profile.availability.join(" · ")}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {profile.badges.length > 0 && (
                <section className="border-t border-slate-100 py-8">
                  <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                    <Award className="h-4 w-4" /> Badges
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {profile.badges.map(({ badge }) => (
                      <div key={badge.name} className="flex items-start gap-3">
                        <span>{badge.icon}</span>
                        <div>
                          <p className="text-sm font-black text-slate-800">{badge.name}</p>
                          <p className="mt-0.5 text-xs leading-5 text-slate-500">{badge.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {profile.reviewsReceived.length > 0 && (
                <section className="border-t border-slate-100 pt-8">
                  <h3 className="text-lg font-black text-slate-950">Member reviews</h3>
                  <div className="mt-5 divide-y divide-slate-100">
                    {profile.reviewsReceived.map((review) => (
                      <article key={review.id} className="py-5 first:pt-0">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-700">
                              {getInitials(review.reviewer.name)}
                            </span>
                            <div>
                              <p className="text-sm font-black text-slate-900">{review.reviewer.name}</p>
                              <div className="mt-1 flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, index) => (
                                  <Star key={index} className={`h-3 w-3 ${index < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        {review.comment && <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{review.comment}</p>}
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </div>

          </div>
        </div>
      </main>

      {showSwapModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between">
              <div><h2 className="text-xl font-black text-slate-950">Request a skill swap</h2><p className="mt-1 text-sm text-slate-500">Propose an exchange with {profile.name}.</p></div>
              <button type="button" onClick={() => setShowSwapModal(false)} className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            {requestError && <div className="mt-5 rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-600">{requestError}</div>}
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.12em] text-slate-400">You will teach</label>
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
                <label className="block text-xs font-black uppercase tracking-[0.12em] text-slate-400">You want to learn</label>
                <div className="mt-2">
                  <Select value={learnSkill} onValueChange={(v) => v && setLearnSkill(v)}>
                    <SelectTrigger className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none focus:border-blue-500">
                      <SelectValue placeholder="Select a skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachingSkills.map((skill) => (
                        <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.12em] text-slate-400">Message <span className="normal-case tracking-normal">(optional)</span></label>
                <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={3} className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium normal-case tracking-normal text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
              </div>
            </div>
            <div className="mt-6 flex gap-3"><button type="button" onClick={() => setShowSwapModal(false)} className="h-12 flex-1 rounded-xl border border-slate-200 text-sm font-extrabold text-slate-600">Cancel</button><button type="button" onClick={sendRequest} disabled={sending || !teachSkill || !learnSkill} className="h-12 flex-1 rounded-xl bg-blue-600 text-sm font-extrabold text-white disabled:opacity-50">{sending ? "Sending..." : "Send request"}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
