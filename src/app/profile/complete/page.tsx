"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  MapPin,
  Globe2,
  Clock,
  GraduationCap,
  BookOpen,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const allSkills = [
  "React", "Next.js", "TypeScript", "Python", "UI Design", "Figma",
  "Photography", "Spanish", "French", "English", "Piano", "Guitar",
  "Marketing", "SEO", "Public Speaking", "Cooking", "Baking", "Fitness",
  "Yoga", "Video Editing", "Canva", "Machine Learning", "Node.js",
  "MongoDB", "Flutter", "Korean", "Portuguese", "German", "Italian", "Japanese",
];

const availabilityOptions = ["Weekdays", "Evenings", "Weekends"];

export default function CompleteProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [languages, setLanguages] = useState("");
  const [availability, setAvailability] = useState<string[]>([]);
  const [teachSkills, setTeachSkills] = useState<string[]>([]);
  const [learnSkills, setLearnSkills] = useState<string[]>([]);

  const steps = [
    { label: "Personal", icon: User },
    { label: "Availability", icon: Clock },
    { label: "Teach", icon: GraduationCap },
    { label: "Learn", icon: BookOpen },
  ];

  const toggleAvailability = (opt: string) => {
    setAvailability((prev) =>
      prev.includes(opt) ? prev.filter((a) => a !== opt) : [...prev, opt]
    );
  };

  const toggleSkill = (skill: string, type: "teach" | "learn") => {
    if (type === "teach") {
      setTeachSkills((prev) =>
        prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
      );
    } else {
      setLearnSkills((prev) =>
        prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
      );
    }
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/profile/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          avatar,
          bio,
          location,
          languages: languages.split(",").map((l) => l.trim()).filter(Boolean),
          availability,
          teachSkills,
          learnSkills,
        }),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      router.push("/discover");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 px-5 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-3xl font-black text-slate-950">Complete your profile</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Tell us about yourself so we can find the best skill matches for you.
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={s.label}
                onClick={() => setStep(i)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold transition ${
                  step === i
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : step > i
                    ? "bg-blue-50 text-blue-600"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {step > i ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                {s.label}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">{error}</div>
        )}

        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
          {/* Step 0: Personal Info */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-xl font-black text-slate-950">Personal Information</h2>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">Profile Photo URL</label>
                <div className="relative mt-2">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell others about yourself, your experience, and what you're passionate about..."
                  rows={4}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">Location</label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">Languages</label>
                <div className="relative mt-2">
                  <Globe2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    placeholder="English, Spanish, French..."
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Availability */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-black text-slate-950">When are you available?</h2>
              <p className="text-sm font-medium text-slate-500">Select all times that work for you.</p>
              <div className="grid grid-cols-3 gap-3">
                {availabilityOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => toggleAvailability(opt)}
                    className={`flex h-20 items-center justify-center rounded-2xl border-2 text-sm font-extrabold transition ${
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
            <div className="space-y-5">
              <h2 className="text-xl font-black text-slate-950">What can you teach?</h2>
              <p className="text-sm font-medium text-slate-500">Select the skills you can share with others.</p>
              <div className="flex flex-wrap gap-2">
                {allSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill, "teach")}
                    className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
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
                <p className="text-xs font-bold text-blue-600">{teachSkills.length} skill{teachSkills.length !== 1 ? "s" : ""} selected</p>
              )}
            </div>
          )}

          {/* Step 3: Skills to Learn */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-black text-slate-950">What do you want to learn?</h2>
              <p className="text-sm font-medium text-slate-500">Select the skills you'd like to acquire.</p>
              <div className="flex flex-wrap gap-2">
                {allSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill, "learn")}
                    className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
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
                <p className="text-xs font-bold text-blue-600">{learnSkills.length} skill{learnSkills.length !== 1 ? "s" : ""} selected</p>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="rounded-xl px-6 py-3 text-sm font-extrabold text-slate-600 transition hover:bg-slate-100"
            >
              Back
            </button>
          ) : (
            <Link href="/" className="rounded-xl px-6 py-3 text-sm font-extrabold text-slate-600 transition hover:bg-slate-100">
              Skip for now
            </Link>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Complete Profile"}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
