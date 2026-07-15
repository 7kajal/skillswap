"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Clock,
  MessageCircle,
  Star,
  Sparkles,
  User,
  MapPin,
  Send,
  Inbox,
  BookOpen,
  Flame,
  Trophy,
  Zap,
  Target,
  TrendingUp,
  Calendar,
  Shield,
  Award,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

type DashboardData = {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    bio: string | null;
    location: string | null;
    rating: number;
    reviewCount: number;
    completedSwaps: number;
    trustScore: number;
    totalHoursShared: number;
    currentStreak: number;
    longestStreak: number;
    verifiedSkills: string[];
  };
  stats: {
    skillsTaught: number;
    skillsLearned: number;
    sessionsCompleted: number;
    hoursShared: number;
    averageRating: number;
    currentStreak: number;
  };
  badges: { name: string; icon: string; description: string; earned: boolean }[];
  recentActivity: { type: string; description: string; date: string }[];
  upcomingSessions: {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    otherUser: { name: string; avatar: string | null };
  }[];
  achievements: {
    id: string;
    name: string;
    icon: string;
    description: string;
    unlocked: boolean;
    progress: number;
    target: number;
  }[];
};

type SwapRequest = {
  id: string;
  status: string;
  message: string | null;
  createdAt: string;
  sender: { id: string; name: string; avatar: string | null };
  receiver: { id: string; name: string; avatar: string | null };
  teachSkill: { name: string };
  learnSkill: { name: string };
};

type ChatRoom = {
  id: string;
  swapRequest: {
    sender: { id: string; name: string; avatar: string | null };
    receiver: { id: string; name: string; avatar: string | null };
    teachSkill: { name: string };
    learnSkill: { name: string };
    status: string;
  };
  messages: { content: string; createdAt: string }[];
};

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [sent, setSent] = useState<SwapRequest[]>([]);
  const [received, setReceived] = useState<SwapRequest[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "received" | "sent" | "chats">("overview");
  const [loading, setLoading] = useState(true);
  const [reviewedSwaps, setReviewedSwaps] = useState<Set<string>>(new Set());

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard").then((r) => r.json()),
      fetch("/api/swap-request").then((r) => r.json()),
      fetch("/api/chat/rooms").then((r) => r.json()),
    ]).then(([dashRes, requestsRes, roomsRes]) => {
      setDashboard(dashRes.data);
      setSent(requestsRes.data?.sent || []);
      setReceived(requestsRes.data?.received || []);
      setChatRooms(Array.isArray(roomsRes.data) ? roomsRes.data : []);
      setLoading(false);

      const completed = [
        ...(requestsRes.data?.sent || []),
        ...(requestsRes.data?.received || []),
      ].filter((r: SwapRequest) => r.status === "completed");

      if (completed.length > 0 && dashRes.data?.user?.id) {
        Promise.all(
          completed.map((r: SwapRequest) =>
            fetch(`/api/review?swapRequestId=${r.id}&reviewerId=${dashRes.data.user.id}`)
              .then((res) => res.json())
              .then((json) => ({ id: r.id, reviewed: json.data && json.data.id }))
              .catch(() => ({ id: r.id, reviewed: false }))
          )
        ).then((results) => {
          const reviewed = new Set<string>();
          results.forEach((r) => {
            if (r.reviewed) reviewed.add(r.id);
          });
          setReviewedSwaps(reviewed);
        });
      }
    });
  }, []);

  const handleRequest = async (id: string, status: string) => {
    await fetch(`/api/swap-request/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setReceived((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setSent((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (status === "accepted") {
      const roomsRes = await fetch("/api/chat/rooms");
      const roomsJson = await roomsRes.json();
      setChatRooms(Array.isArray(roomsJson.data) ? roomsJson.data : []);
    }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-600",
    accepted: "bg-emerald-50 text-emerald-600",
    rejected: "bg-red-50 text-red-600",
    completed: "bg-blue-50 text-blue-600",
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!dashboard) return null;

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: Sparkles },
    { id: "received" as const, label: "Received", icon: Inbox, count: received.filter((r) => r.status === "pending").length },
    { id: "sent" as const, label: "Sent", icon: Send, count: sent.length },
    { id: "chats" as const, label: "Chats", icon: MessageCircle, count: chatRooms.length },
  ];

  return (
    <div className="bg-slate-50">
      {/* Profile Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              {dashboard.user.avatar ? (
                <img src={dashboard.user.avatar} alt={dashboard.user.name} className="h-20 w-20 rounded-2xl object-cover" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-black text-white">
                  {dashboard.user.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-950">{dashboard.user.name}</h1>
                  <BadgeCheck className="h-5 w-5 fill-blue-600 text-white" />
                </div>
                {dashboard.user.location && (
                  <p className="mt-1 flex items-center gap-1 text-sm font-medium text-slate-500">
                    <MapPin className="h-4 w-4" /> {dashboard.user.location}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-4">
                  <span className="flex items-center gap-1 text-sm font-bold text-slate-700">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {dashboard.user.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-slate-500">{dashboard.user.reviewCount} reviews</span>
                  <span className="text-sm text-slate-500">{dashboard.user.completedSwaps} exchanges</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/sessions"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
              >
                <Calendar className="h-4 w-4" />
                Sessions
              </Link>
              <Link
                href="/reputation"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
              >
                <Shield className="h-4 w-4" />
                Reputation
              </Link>
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Discover
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Badges */}
          {dashboard.badges.filter((b) => b.earned).length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {dashboard.badges.filter((b) => b.earned).map((b) => (
                <span
                  key={b.name}
                  className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-600"
                >
                  {b.icon} {b.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:px-8">
        {/* Profile Incomplete Banner */}
        {dashboard.user.bio === null && (
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

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200">
          {tabs.map((tab) => {
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
                {"count" in tab && tab.count && tab.count > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-100 px-1.5 text-[10px] font-extrabold text-blue-600">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="mt-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <StatCard icon={BookOpen} label="Skills Taught" value={dashboard.stats.skillsTaught} color="blue" />
              <StatCard icon={Target} label="Skills Learned" value={dashboard.stats.skillsLearned} color="violet" />
              <StatCard icon={Check} label="Sessions" value={dashboard.stats.sessionsCompleted} color="emerald" />
              <StatCard icon={Clock} label="Hours Shared" value={dashboard.stats.hoursShared} color="amber" />
              <StatCard icon={Star} label="Avg Rating" value={dashboard.stats.averageRating} suffix="" color="rose" />
              <StatCard icon={Flame} label="Day Streak" value={dashboard.stats.currentStreak} color="orange" />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              {/* Achievements */}
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-slate-950">Achievements</h2>
                  <Trophy className="h-5 w-5 text-amber-400" />
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {dashboard.achievements.map((ach) => (
                    <div
                      key={ach.id}
                      className={`rounded-xl border p-4 transition ${
                        ach.unlocked
                          ? "border-blue-200 bg-blue-50"
                          : "border-slate-200 bg-slate-50 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{ach.icon}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-black text-slate-900 truncate">{ach.name}</p>
                          <p className="text-[10px] font-medium text-slate-500 truncate">{ach.description}</p>
                        </div>
                        {ach.unlocked && (
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600">
                            <Check className="h-3 w-3 text-white" />
                          </span>
                        )}
                      </div>
                      {!ach.unlocked && (
                        <div className="mt-3">
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-blue-400"
                              style={{ width: `${(ach.progress / ach.target) * 100}%` }}
                            />
                          </div>
                          <p className="mt-1 text-[10px] font-bold text-slate-400">
                            {ach.progress}/{ach.target}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Upcoming Sessions */}
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-slate-950">Upcoming Sessions</h2>
                    <Link href="/sessions" className="text-xs font-extrabold text-blue-600 hover:underline">
                      View All
                    </Link>
                  </div>
                  {dashboard.upcomingSessions.length === 0 ? (
                    <p className="mt-4 text-sm font-medium text-slate-400">No upcoming sessions</p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {dashboard.upcomingSessions.map((session) => (
                        <div key={session.id} className="rounded-xl bg-slate-50 p-3">
                          <p className="text-sm font-bold text-slate-900">{session.title}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {new Date(session.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at {session.startTime}
                          </p>
                          <p className="mt-0.5 text-xs font-bold text-blue-600">with {session.otherUser.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Activity */}
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-black text-slate-950">Recent Activity</h2>
                  {dashboard.recentActivity.length === 0 ? (
                    <p className="mt-4 text-sm font-medium text-slate-400">No recent activity</p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {dashboard.recentActivity.slice(0, 5).map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                            activity.type === "swap_completed" ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                          }`}>
                            {activity.type === "swap_completed" ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Star className="h-3 w-3" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-600">{activity.description}</p>
                            <p className="text-[10px] text-slate-400">
                              {new Date(activity.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Links */}
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-black text-slate-950">Quick Actions</h2>
                  <div className="mt-4 space-y-2">
                    <Link href="/discover" className="flex items-center justify-between rounded-xl bg-blue-50 p-3 transition hover:bg-blue-100">
                      <span className="text-sm font-bold text-blue-600">Find Skill Partners</span>
                      <ChevronRight className="h-4 w-4 text-blue-400" />
                    </Link>
                    <Link href="/sessions" className="flex items-center justify-between rounded-xl bg-emerald-50 p-3 transition hover:bg-emerald-100">
                      <span className="text-sm font-bold text-emerald-600">Schedule Session</span>
                      <ChevronRight className="h-4 w-4 text-emerald-400" />
                    </Link>
                    <Link href="/reputation" className="flex items-center justify-between rounded-xl bg-violet-50 p-3 transition hover:bg-violet-100">
                      <span className="text-sm font-bold text-violet-600">View Reputation</span>
                      <ChevronRight className="h-4 w-4 text-violet-400" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Request/Chat Tabs */}
        {activeTab === "received" && (
          <div className="mt-6 space-y-4">
            {received.length === 0 ? (
              <EmptyState icon={Inbox} title="No requests yet" description="When someone sends you a skill swap request, it will appear here." />
            ) : (
              received.map((req) => (
                <RequestCard
                  key={req.id}
                  request={req}
                  otherUser={req.sender}
                  type="received"
                  statusColors={statusColors}
                  onAccept={() => handleRequest(req.id, "accepted")}
                  onReject={() => handleRequest(req.id, "rejected")}
                  alreadyReviewed={reviewedSwaps.has(req.id)}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "sent" && (
          <div className="mt-6 space-y-4">
            {sent.length === 0 ? (
              <EmptyState icon={Send} title="No sent requests" description="Visit the Discover page to find skill exchange partners." />
            ) : (
              sent.map((req) => (
                <RequestCard
                  key={req.id}
                  request={req}
                  otherUser={req.receiver}
                  type="sent"
                  statusColors={statusColors}
                  alreadyReviewed={reviewedSwaps.has(req.id)}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "chats" && (
          <div className="mt-6 space-y-4">
            {chatRooms.length === 0 ? (
              <EmptyState icon={MessageCircle} title="No active chats" description="Once a skill swap request is accepted, a chat room will be created here." />
            ) : (
              chatRooms.map((room) => {
                const other = dashboard.user.id === room.swapRequest.sender.id
                  ? room.swapRequest.receiver
                  : room.swapRequest.sender;
                const lastMsg = room.messages[0];

                return (
                  <Link
                    key={room.id}
                    href={`/chat/${room.id}`}
                    className="flex items-center gap-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-lg"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-sm font-black text-white">
                      {other.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-black text-slate-950">{other.name}</h3>
                        {lastMsg && (
                          <span className="text-xs text-slate-400">
                            {new Date(lastMsg.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs font-bold text-blue-600">
                        {room.swapRequest.teachSkill.name} ↔ {room.swapRequest.learnSkill.name}
                      </p>
                      {lastMsg && (
                        <p className="mt-1 truncate text-sm text-slate-500">{lastMsg.content}</p>
                      )}
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-slate-300" />
                  </Link>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  suffix?: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorMap[color] || colorMap.blue}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-2xl font-black text-slate-950">
        {value}{suffix !== undefined ? suffix : ""}
      </p>
      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{label}</p>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-xl font-black text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm font-medium text-slate-500">{description}</p>
    </div>
  );
}

function RequestCard({
  request,
  otherUser,
  type,
  statusColors,
  onAccept,
  onReject,
  alreadyReviewed,
}: {
  request: SwapRequest;
  otherUser: { id: string; name: string; avatar: string | null };
  type: "sent" | "received";
  statusColors: Record<string, string>;
  onAccept?: () => void;
  onReject?: () => void;
  alreadyReviewed?: boolean;
}) {
  const initials = otherUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {otherUser.avatar ? (
            <img src={otherUser.avatar} alt={otherUser.name} className="h-14 w-14 rounded-2xl object-cover" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-sm font-black text-white">
              {initials}
            </div>
          )}
          <div>
            <h3 className="font-black text-slate-950">{otherUser.name}</h3>
            <p className="mt-1 text-xs text-slate-500">
              {type === "sent" ? "Sent to" : "Received from"} {otherUser.name}
            </p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${statusColors[request.status] || ""}`}>
          {request.status}
        </span>
      </div>

      <div className="mt-5 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-slate-400">
            {type === "sent" ? "You teach" : "They teach"}
          </p>
          <p className="mt-2 font-black text-slate-900">{request.teachSkill.name}</p>
        </div>
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="rounded-2xl bg-blue-50 p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-blue-500">
            {type === "sent" ? "You learn" : "They learn"}
          </p>
          <p className="mt-2 font-black text-slate-900">{request.learnSkill.name}</p>
        </div>
      </div>

      {request.message && (
        <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{request.message}</p>
      )}

      {type === "received" && request.status === "pending" && (
        <div className="mt-5 flex gap-3">
          <button
            onClick={onReject}
            className="flex-1 rounded-xl border border-red-200 bg-white py-3 text-sm font-extrabold text-red-600 transition hover:bg-red-50"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            <Check className="h-4 w-4" />
            Accept
          </button>
        </div>
      )}

      {request.status === "accepted" && (
        <div className="mt-5">
          <Link
            href={`/chat/${request.id}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 text-sm font-extrabold text-emerald-600 transition hover:bg-emerald-100"
          >
            <MessageCircle className="h-4 w-4" />
            Open Chat
          </Link>
        </div>
      )}

      {request.status === "completed" && (
        <div className="mt-5">
          {alreadyReviewed ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-3 text-sm font-extrabold text-slate-500">
              <Star className="h-4 w-4" />
              Reviewed
            </div>
          ) : (
            <Link
              href={`/review/${request.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-50 py-3 text-sm font-extrabold text-amber-600 transition hover:bg-amber-100"
            >
              <Star className="h-4 w-4" />
              Leave Review
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
