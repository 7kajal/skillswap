"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  User,
  MapPin,
  Globe2,
  Clock,
  GraduationCap,
  BookOpen,
  ArrowRight,
  Check,
  GitBranch,
  Link2,
} from "lucide-react";
import Link from "next/link";
import axiosPrivate from "@/lib/axiosPrivate";
import { useToast } from "@/component/toast";

const allSkills = [
  "React",
  "Next.js",
  "TypeScript",
  "Python",
  "UI Design",
  "Figma",
  "Photography",
  "Spanish",
  "French",
  "English",
  "Piano",
  "Guitar",
  "Marketing",
  "SEO",
  "Public Speaking",
  "Cooking",
  "Baking",
  "Fitness",
  "Yoga",
  "Video Editing",
  "Canva",
  "Machine Learning",
  "Node.js",
  "MongoDB",
  "Flutter",
  "Korean",
  "Portuguese",
  "German",
  "Italian",
  "Japanese",
];

const availabilityOptions = ["Weekdays", "Evenings", "Weekends"];

export default function CompleteProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [languages, setLanguages] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [availability, setAvailability] = useState<string[]>([]);
  const [teachSkills, setTeachSkills] = useState<string[]>([]);
  const [learnSkills, setLearnSkills] = useState<string[]>([]);

  useEffect(() => {
    if (status !== "authenticated") return;

    axiosPrivate
      .get("/api/profile")
      .then((response) => {
        const profile = response.data.data;
        if (!profile?.isProfileComplete) return;

        setEditing(true);
        setAvatar(profile.avatar || "");
        setBio(profile.bio || "");
        setLocation(profile.location || "");
        setLanguages((profile.languages || []).join(", "));
        setAvailability(profile.availability || []);
        setGithubUrl(profile.githubUrl || "");
        setPortfolioUrl(profile.portfolioUrl || "");
        setLinkedinUrl(profile.linkedinUrl || "");
        setTeachSkills(
          profile.userSkills
            .filter((skill: { type: string }) => skill.type === "teach")
            .map((skill: { skill: { name: string } }) => skill.skill.name),
        );
        setLearnSkills(
          profile.userSkills
            .filter((skill: { type: string }) => skill.type === "learn")
            .map((skill: { skill: { name: string } }) => skill.skill.name),
        );
      })
      .catch(() => undefined);
  }, [status]);

  const steps = [
    { label: "Personal", icon: User },
    { label: "Availability", icon: Clock },
    { label: "Teach", icon: GraduationCap },
    { label: "Learn", icon: BookOpen },
  ];

  const toggleAvailability = (opt: string) => {
    setAvailability((prev) =>
      prev.includes(opt) ? prev.filter((a) => a !== opt) : [...prev, opt],
    );
  };

  const toggleSkill = (skill: string, type: "teach" | "learn") => {
    if (type === "teach") {
      setTeachSkills((prev) =>
        prev.includes(skill)
          ? prev.filter((s) => s !== skill)
          : [...prev, skill],
      );
    } else {
      setLearnSkills((prev) =>
        prev.includes(skill)
          ? prev.filter((s) => s !== skill)
          : [...prev, skill],
      );
    }
  };

  const handleSubmit = async () => {
    if (teachSkills.length === 0) {
      showToast({
        type: "error",
        title: "Select teach skills",
        message: "Please select at least one skill you can teach.",
      });
      return;
    }
    if (learnSkills.length === 0) {
      showToast({
        type: "error",
        title: "Select learn skills",
        message: "Please select at least one skill you want to learn.",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await axiosPrivate.post("/api/profile/complete", {
        avatar,
        bio,
        location,
        languages: languages
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean),
        availability,
        githubUrl,
        portfolioUrl,
        linkedinUrl,
        teachSkills,
        learnSkills,
      });
      if (!res.data.success)
        throw new Error(res.data.message || "Failed to save profile");
      router.push(
        session?.user?.id ? `/profile/${session.user.id}` : "/discover",
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      showToast({ type: "error", title: "Profile error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 px-4 py-8 sm:px-6 sm:py-12 min-h-screen">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="text-xl font-black text-slate-950 sm:text-3xl">
            {editing ? "Edit your profile" : "Complete your profile"}
          </h1>
          <p className="mt-1.5 text-xs font-medium text-slate-500 sm:mt-2 sm:text-sm">
            {editing
              ? "Keep your skills and availability current so every match stays relevant."
              : "Tell us about yourself so we can find the best skill matches for you."}
          </p>
        </div>

        {/* Responsive Step indicator */}
        <div className="mb-6 flex items-center justify-center gap-3 sm:gap-4">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={s.label}
                type="button"
                onClick={() => setStep(i)}
                className={`flex items-center justify-center transition-all ${
                  step === i
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 scale-105"
                    : step > i
                      ? "bg-blue-50 text-blue-600"
                      : "bg-slate-100 text-slate-400"
                } h-11 w-11 rounded-full sm:h-auto sm:w-auto sm:rounded-full sm:px-4 sm:py-2.5 text-xs font-extrabold`}
              >
                {step > i ? (
                  <Check className="h-4 w-4 shrink-0 sm:h-3.5 sm:w-3.5" />
                ) : (
                  <Icon className="h-4 w-4 shrink-0 sm:h-3.5 sm:w-3.5" />
                )}
                <span className="hidden sm:ml-2 sm:inline">{s.label}</span>
              </button>
            );
          })}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)] sm:p-8">
          {/* Step 0: Personal Info */}
          {step === 0 && (
            <div className="space-y-4 sm:space-y-5">
              <h2 className="text-lg font-black text-slate-950 sm:text-xl">
                Personal Information
              </h2>

              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400 sm:text-xs">
                  Profile Photo URL
                </label>
                <div className="relative mt-1.5 sm:mt-2">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 sm:h-5 sm:w-5" />
                  <input
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:h-14 sm:pl-12 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400 sm:text-xs">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell others about yourself, your experience, and what you're passionate about..."
                  rows={4}
                  className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:mt-2 sm:p-4 sm:text-sm"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400 sm:text-xs">
                  Location
                </label>
                <div className="relative mt-1.5 sm:mt-2">
                  <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 sm:h-5 sm:w-5" />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:h-14 sm:pl-12 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400 sm:text-xs">
                  Languages
                </label>
                <div className="relative mt-1.5 sm:mt-2">
                  <Globe2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 sm:h-5 sm:w-5" />
                  <input
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    placeholder="English, Spanish, French..."
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:h-14 sm:pl-12 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400 sm:text-xs">
                  Links
                </label>
                <div className="mt-1.5 space-y-2.5 sm:mt-2 sm:space-y-3">
                  <div className="relative">
                    <GitBranch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 sm:h-5 sm:w-5" />
                    <input
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:h-14 sm:pl-12 sm:text-sm"
                    />
                  </div>
                  <div className="relative">
                    <Globe2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 sm:h-5 sm:w-5" />
                    <input
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://yoursite.com"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:h-14 sm:pl-12 sm:text-sm"
                    />
                  </div>
                  <div className="relative">
                    <Link2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 sm:h-5 sm:w-5" />
                    <input
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:h-14 sm:pl-12 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Availability */}
          {step === 1 && (
            <div className="space-y-4 sm:space-y-5">
              <h2 className="text-lg font-black text-slate-950 sm:text-xl">
                When are you available?
              </h2>
              <p className="text-xs font-medium text-slate-500 sm:text-sm">
                Select all times that work for you.
              </p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
                {availabilityOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleAvailability(opt)}
                    className={`flex h-14 items-center justify-center rounded-2xl border-2 text-xs font-extrabold transition sm:h-20 sm:text-sm ${
                      availability.includes(opt)
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-200"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Skills to Teach */}
          {step === 2 && (
            <div className="space-y-4 sm:space-y-5">
              <h2 className="text-lg font-black text-slate-950 sm:text-xl">
                What can you teach?
              </h2>
              <p className="text-xs font-medium text-slate-500 sm:text-sm">
                Select the skills you can share with others.
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {allSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill, "teach")}
                    className={`rounded-xl px-3 py-2 text-xs font-bold transition sm:px-4 sm:py-2.5 sm:text-sm ${
                      teachSkills.includes(skill)
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {teachSkills.length > 0 && (
                <p className="text-xs font-bold text-blue-600">
                  {teachSkills.length} skill
                  {teachSkills.length !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>
          )}

          {/* Step 3: Skills to Learn */}
          {step === 3 && (
            <div className="space-y-4 sm:space-y-5">
              <h2 className="text-lg font-black text-slate-950 sm:text-xl">
                What do you want to learn?
              </h2>
              <p className="text-xs font-medium text-slate-500 sm:text-sm">
                Select the skills you'd like to acquire.
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {allSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill, "learn")}
                    className={`rounded-xl px-3 py-2 text-xs font-bold transition sm:px-4 sm:py-2.5 sm:text-sm ${
                      learnSkills.includes(skill)
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {learnSkills.length > 0 && (
                <p className="text-xs font-bold text-blue-600">
                  {learnSkills.length} skill
                  {learnSkills.length !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="mt-5 flex items-center justify-between sm:mt-6">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="rounded-xl px-4 py-2.5 text-xs font-extrabold text-slate-600 transition hover:bg-slate-100 sm:px-6 sm:py-3 sm:text-sm"
            >
              Back
            </button>
          ) : (
            <Link
              href={session?.user?.id ? `/profile/${session.user.id}` : "/"}
              className="rounded-xl px-4 py-2.5 text-xs font-extrabold text-slate-600 transition hover:bg-slate-100 sm:px-6 sm:py-3 sm:text-sm"
            >
              {editing ? "Cancel" : "Skip for now"}
            </Link>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 2 && teachSkills.length === 0) {
                  showToast({
                    type: "error",
                    title: "Select teach skills",
                    message: "Please select at least one skill you can teach.",
                  });
                  return;
                }
                setStep(step + 1);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 sm:gap-2 sm:px-6 sm:py-3 sm:text-sm"
            >
              Continue
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50 sm:gap-2 sm:px-6 sm:py-3 sm:text-sm"
            >
              {loading
                ? "Saving..."
                : editing
                  ? "Save changes"
                  : "Complete Profile"}
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
