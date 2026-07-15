"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Video,
  X,
  Check,
  MapPin,
  Trash2,
  ArrowLeft,
  CalendarCheck,
  CalendarX,
} from "lucide-react";
import Link from "next/link";

type Session = {
  id: string;
  swapRequestId: string;
  organizer: { id: string; name: string; avatar: string | null };
  participant: { id: string; name: string; avatar: string | null };
  title: string;
  description: string | null;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  status: string;
  meetLink: string | null;
  notes: string | null;
  teachSkill: string;
  learnSkill: string;
};

type SwapRequest = {
  id: string;
  status: string;
  sender: { id: string; name: string };
  receiver: { id: string; name: string };
  teachSkill: { name: string };
  learnSkill: { name: string };
};

type Availability = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function SessionsPage() {
  const [upcoming, setUpcoming] = useState<Session[]>([]);
  const [past, setPast] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "availability">("upcoming");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [acceptedSwaps, setAcceptedSwaps] = useState<SwapRequest[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");

  const [newSession, setNewSession] = useState({
    swapRequestId: "",
    title: "",
    description: "",
    date: "",
    startTime: "09:00",
    endTime: "10:00",
    meetLink: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/sessions").then((r) => r.json()),
      fetch("/api/swap-request").then((r) => r.json()),
      fetch("/api/availability").then((r) => r.json()),
      fetch("/api/profile").then((r) => r.json()),
    ]).then(([sessionsRes, swapsRes, availRes, profileRes]) => {
      if (sessionsRes.data) {
        setUpcoming(sessionsRes.data.upcoming || []);
        setPast(sessionsRes.data.past || []);
      }
      const all = [...(swapsRes.data?.sent || []), ...(swapsRes.data?.received || [])];
      setAcceptedSwaps(all.filter((s: SwapRequest) => s.status === "accepted"));
      setAvailability(availRes.data || []);
      setCurrentUserId(profileRes.data?.id || "");
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const scheduleSession = async () => {
    if (!newSession.swapRequestId || !newSession.title || !newSession.date) return;
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSession),
    });
    const json = await res.json();
    if (json.success) {
      setUpcoming((prev) => [json.data, ...prev]);
      setShowScheduleModal(false);
      setNewSession({ swapRequestId: "", title: "", description: "", date: "", startTime: "09:00", endTime: "10:00", meetLink: "" });
    }
  };

  const updateSession = async (sessionId: string, status: string) => {
    const res = await fetch(`/api/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (json.success) {
      if (status === "completed") {
        setUpcoming((prev) => prev.filter((s) => s.id !== sessionId));
        setPast((prev) => [json.data, ...prev]);
      } else {
        setUpcoming((prev) => prev.map((s) => s.id === sessionId ? json.data : s));
      }
    }
  };

  const saveAvailability = async () => {
    await fetch("/api/availability", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slots: availability.map(({ dayOfWeek, startTime, endTime }) => ({ dayOfWeek, startTime, endTime })),
      }),
    });
  };

  const addAvailabilitySlot = () => {
    setAvailability((prev) => [
      ...prev,
      { id: `temp-${Date.now()}`, dayOfWeek: 1, startTime: "09:00", endTime: "10:00" },
    ]);
  };

  const removeAvailabilitySlot = (id: string) => {
    setAvailability((prev) => prev.filter((s) => s.id !== id));
  };

  const updateAvailabilitySlot = (id: string, field: string, value: string | number) => {
    setAvailability((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-5 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <h1 className="text-2xl font-black text-slate-950">Sessions</h1>
              </div>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Schedule and manage your learning sessions
              </p>
            </div>
            {acceptedSwaps.length > 0 && (
              <button
                onClick={() => setShowScheduleModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Schedule Session
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-2 border-b border-slate-200">
            {[
              { id: "upcoming" as const, label: "Upcoming", icon: CalendarCheck, count: upcoming.length },
              { id: "past" as const, label: "Past", icon: CalendarX, count: past.length },
              { id: "availability" as const, label: "Availability", icon: Clock, count: availability.length },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-extrabold transition ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-100 px-1.5 text-[10px] font-extrabold text-blue-600">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 lg:px-8">
        {/* Upcoming Sessions */}
        {activeTab === "upcoming" && (
          <div className="space-y-4">
            {upcoming.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-black text-slate-950">No upcoming sessions</h3>
                <p className="mx-auto mt-2 max-w-md text-sm font-medium text-slate-500">
                  Schedule a session with one of your accepted skill swap partners.
                </p>
                {acceptedSwaps.length > 0 && (
                  <button
                    onClick={() => setShowScheduleModal(true)}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    Schedule Your First Session
                  </button>
                )}
              </div>
            ) : (
              upcoming.map((session) => {
                const other = session.organizer.id === currentUserId ? session.participant : session.organizer;
                return (
                  <div
                    key={session.id}
                    className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-black text-slate-950">{session.title}</h3>
                        <p className="mt-1 text-sm font-medium text-slate-500">
                          with {other.name}
                        </p>
                      </div>
                      <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-600">
                        {session.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-700">{formatDate(session.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-700">{session.startTime} - {session.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                        <Video className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-bold text-blue-600">{session.teachSkill} ↔ {session.learnSkill}</span>
                      </div>
                    </div>

                    {session.description && (
                      <p className="mt-3 text-sm text-slate-500">{session.description}</p>
                    )}

                    {session.meetLink && (
                      <a
                        href={session.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-extrabold text-emerald-600 transition hover:bg-emerald-100"
                      >
                        <Video className="h-4 w-4" />
                        Join Meeting
                      </a>
                    )}

                    <div className="mt-4 flex gap-3">
                      {session.status === "scheduled" && (
                        <button
                          onClick={() => updateSession(session.id, "completed")}
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-extrabold text-emerald-600 transition hover:bg-emerald-100"
                        >
                          <Check className="h-4 w-4" />
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Past Sessions */}
        {activeTab === "past" && (
          <div className="space-y-4">
            {past.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <CalendarX className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-black text-slate-950">No past sessions</h3>
                <p className="mx-auto mt-2 max-w-md text-sm font-medium text-slate-500">
                  Your completed and cancelled sessions will appear here.
                </p>
              </div>
            ) : (
              past.map((session) => {
                const other = session.organizer.id === currentUserId ? session.participant : session.organizer;
                return (
                  <div
                    key={session.id}
                    className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm opacity-75"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-black text-slate-950">{session.title}</h3>
                        <p className="mt-1 text-sm font-medium text-slate-500">with {other.name}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${
                        session.status === "completed"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-600"
                      }`}>
                        {session.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-700">{formatDate(session.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-700">{session.startTime} - {session.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                        <Video className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-bold text-blue-600">{session.teachSkill} ↔ {session.learnSkill}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Availability */}
        {activeTab === "availability" && (
          <div>
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-950">Weekly Availability</h2>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    Set your available time slots for scheduling sessions
                  </p>
                </div>
                <button
                  onClick={addAvailabilitySlot}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Slot
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {availability.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                    <Clock className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-3 text-sm font-bold text-slate-400">No availability set. Add time slots to get started.</p>
                  </div>
                )}
                {availability.map((slot) => (
                  <div key={slot.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <select
                      value={slot.dayOfWeek}
                      onChange={(e) => updateAvailabilitySlot(slot.id, "dayOfWeek", parseInt(e.target.value))}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 outline-none"
                    >
                      {DAYS.map((day, idx) => (
                        <option key={idx} value={idx}>{day}</option>
                      ))}
                    </select>
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateAvailabilitySlot(slot.id, "startTime", e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 outline-none"
                    />
                    <span className="text-sm font-bold text-slate-400">to</span>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateAvailabilitySlot(slot.id, "endTime", e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 outline-none"
                    />
                    <button
                      onClick={() => removeAvailabilitySlot(slot.id)}
                      className="ml-auto rounded-xl p-2.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {availability.length > 0 && (
                <button
                  onClick={saveAvailability}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  <Check className="h-4 w-4" />
                  Save Availability
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Schedule Session Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-950">Schedule Session</h2>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Swap Partner
                </label>
                <select
                  value={newSession.swapRequestId}
                  onChange={(e) => {
                    const swap = acceptedSwaps.find((s) => s.id === e.target.value);
                    setNewSession((prev) => ({
                      ...prev,
                      swapRequestId: e.target.value,
                      title: swap ? `${swap.teachSkill.name} ↔ ${swap.learnSkill.name} Session` : prev.title,
                    }));
                  }}
                  className="mt-2 h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none"
                >
                  <option value="">Select a partner</option>
                  {acceptedSwaps.map((swap) => {
                    const other = swap.sender.id === currentUserId ? swap.receiver : swap.sender;
                    return (
                      <option key={swap.id} value={swap.id}>
                        {other.name} - {swap.teachSkill.name} ↔ {swap.learnSkill.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Session Title
                </label>
                <input
                  value={newSession.title}
                  onChange={(e) => setNewSession((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., React Hooks Deep Dive"
                  className="mt-2 h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Description (optional)
                </label>
                <textarea
                  value={newSession.description}
                  onChange={(e) => setNewSession((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="What will you cover in this session?"
                  rows={2}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">Date</label>
                  <input
                    type="date"
                    value={newSession.date}
                    onChange={(e) => setNewSession((prev) => ({ ...prev, date: e.target.value }))}
                    className="mt-2 h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">Start</label>
                  <input
                    type="time"
                    value={newSession.startTime}
                    onChange={(e) => setNewSession((prev) => ({ ...prev, startTime: e.target.value }))}
                    className="mt-2 h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">End</label>
                  <input
                    type="time"
                    value={newSession.endTime}
                    onChange={(e) => setNewSession((prev) => ({ ...prev, endTime: e.target.value }))}
                    className="mt-2 h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Meeting Link (optional)
                </label>
                <input
                  value={newSession.meetLink}
                  onChange={(e) => setNewSession((prev) => ({ ...prev, meetLink: e.target.value }))}
                  placeholder="https://meet.google.com/..."
                  className="mt-2 h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 rounded-xl border border-slate-200 py-3.5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={scheduleSession}
                disabled={!newSession.swapRequestId || !newSession.title || !newSession.date}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50"
              >
                <CalendarCheck className="h-4 w-4" />
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
