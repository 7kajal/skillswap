"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Inbox,
  MessageCircleMore,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import axiosPrivate from "@/lib/axiosPrivate";

type DashboardData = {
  user: { id: string; name: string };
  stats: {
    skillsTaught: number;
    skillsLearned: number;
    completedSwaps: number;
    hoursShared: number;
    averageRating: number;
  };
  badges: { name: string; icon: string; description: string; earned: boolean }[];
  recentActivity: { type: string; description: string; date: string }[];
  upcomingSessions: {
    id: string;
    title: string;
    date: string;
    startTime: string;
    otherUser: { name: string; avatar: string | null };
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

type Tab = "overview" | "received" | "sent" | "chats";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  accepted: "bg-emerald-50 text-emerald-700",
  rejected: "bg-rose-50 text-rose-700",
  completed: "bg-blue-50 text-blue-700",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [sentRequests, setSentRequests] = useState<SwapRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<SwapRequest[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axiosPrivate.get("/api/dashboard"),
      axiosPrivate.get("/api/swap-request"),
      axiosPrivate.get("/api/chat/rooms"),
    ])
      .then(([dashboardResponse, requestsResponse, roomsResponse]) => {
        setDashboard(dashboardResponse.data.data || null);
        setSentRequests(requestsResponse.data.data?.sent || []);
        setReceivedRequests(requestsResponse.data.data?.received || []);
        setChatRooms(Array.isArray(roomsResponse.data.data) ? roomsResponse.data.data : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateRequest = async (id: string, status: "accepted" | "rejected") => {
    const response = await axiosPrivate.patch(`/api/swap-request/${id}`, { status });
    const result = response.data;
    if (!result.success) return;

    setReceivedRequests((requests) =>
      requests.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );

    if (status === "accepted") {
      const roomsResponse = await axiosPrivate.get("/api/chat/rooms");
      setChatRooms(Array.isArray(roomsResponse.data.data) ? roomsResponse.data.data : []);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-5 text-center">
        <div><h1 className="text-2xl font-black text-slate-950">Swap center unavailable</h1><p className="mt-2 text-sm text-slate-500">Please sign in and try again.</p></div>
      </div>
    );
  }

  const pendingCount = receivedRequests.filter(
    (request) => request.status === "pending"
  ).length;
  const earnedBadges = dashboard.badges.filter((badge) => badge.earned);
  const hasOverviewContent =
    dashboard.upcomingSessions.length > 0 ||
    dashboard.recentActivity.length > 0 ||
    earnedBadges.length > 0;

  const tabs: { id: Tab; label: string; icon: typeof Sparkles; count?: number }[] = [
    { id: "overview", label: "Overview", icon: Sparkles },
    { id: "received", label: "Requests", icon: Inbox, count: pendingCount },
    { id: "sent", label: "Sent", icon: Send, count: sentRequests.length },
    { id: "chats", label: "Messages", icon: MessageCircleMore, count: chatRooms.length },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-6xl px-5 py-9 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">Your exchanges</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.045em] text-slate-950">Swap center</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">Manage requests, conversations, and upcoming learning sessions.</p>

          <div className="mt-7 flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 sm:w-fit">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-extrabold transition ${activeTab === tab.id ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                >
                  <Icon className="h-4 w-4" /> {tab.label}
                  {Boolean(tab.count) && <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-600">{tab.count}</span>}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-9">
        {activeTab === "overview" && (
          <div className="space-y-8">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-5 sm:divide-y-0">
                {[
                  ["Skills taught", dashboard.stats.skillsTaught],
                  ["Skills learning", dashboard.stats.skillsLearned],
                  ["Completed swaps", dashboard.stats.completedSwaps],
                  ["Hours shared", `${dashboard.stats.hoursShared}h`],
                  ["Average rating", dashboard.stats.averageRating.toFixed(1)],
                ].map(([label, value]) => (
                  <div key={label} className="px-5 py-5">
                    <p className="text-2xl font-black text-slate-950">{value}</p>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
            </section>

            {!hasOverviewContent ? (
              <section className="rounded-[26px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Sparkles className="h-6 w-6" /></span>
                <h2 className="mt-5 text-xl font-black text-slate-950">Your first swap starts in Discover</h2>
                <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">Find someone whose skills complement yours, then send a thoughtful request.</p>
                <Link href="/discover" className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-extrabold text-white">Explore members <ChevronRight className="h-4 w-4" /></Link>
              </section>
            ) : (
              <div className="grid gap-8 lg:grid-cols-2">
                {dashboard.upcomingSessions.length > 0 && (
                  <section>
                    <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-black text-slate-950">Upcoming sessions</h2><Link href="/sessions" className="text-sm font-black text-blue-600">View all</Link></div>
                    <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white px-5">
                      {dashboard.upcomingSessions.map((session) => (
                        <div key={session.id} className="flex items-center gap-4 py-5">
                          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><CalendarDays className="h-5 w-5" /></span>
                          <div className="min-w-0 flex-1"><p className="truncate text-sm font-black text-slate-900">{session.title}</p><p className="mt-1 text-xs font-medium text-slate-500">with {session.otherUser.name} · {new Date(session.date).toLocaleDateString()} at {session.startTime}</p></div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {dashboard.recentActivity.length > 0 && (
                  <section>
                    <h2 className="mb-4 text-lg font-black text-slate-950">Recent activity</h2>
                    <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white px-5">
                      {dashboard.recentActivity.map((activity, index) => (
                        <div key={`${activity.date}-${index}`} className="flex gap-3 py-5"><span className="mt-1 h-2 w-2 rounded-full bg-blue-600" /><div><p className="text-sm font-bold text-slate-700">{activity.description}</p><p className="mt-1 text-xs text-slate-400">{new Date(activity.date).toLocaleDateString()}</p></div></div>
                      ))}
                    </div>
                  </section>
                )}

                {earnedBadges.length > 0 && (
                  <section className="lg:col-span-2"><h2 className="mb-4 text-lg font-black text-slate-950">Earned badges</h2><div className="flex flex-wrap gap-3">{earnedBadges.map((badge) => <span key={badge.name} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700"><span>{badge.icon}</span>{badge.name}</span>)}</div></section>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "received" && (
          <RequestList
            requests={receivedRequests}
            emptyTitle="No incoming requests"
            emptyDescription="Requests from matching members will appear here."
            currentUserId={dashboard.user.id}
            onAccept={(id) => updateRequest(id, "accepted")}
            onReject={(id) => updateRequest(id, "rejected")}
          />
        )}

        {activeTab === "sent" && (
          <RequestList
            requests={sentRequests}
            emptyTitle="No sent requests"
            emptyDescription="Explore member profiles and propose your first exchange."
            currentUserId={dashboard.user.id}
          />
        )}

        {activeTab === "chats" && (
          chatRooms.length === 0 ? (
            <EmptyState title="No conversations yet" description="A private conversation is created after a request is accepted." icon={MessageCircleMore} />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {chatRooms.map((room, index) => {
                const otherUser = dashboard.user.id === room.swapRequest.sender.id ? room.swapRequest.receiver : room.swapRequest.sender;
                const latestMessage = room.messages.at(-1);
                return (
                  <Link key={room.id} href={`/chat/${room.id}`} className={`flex items-center gap-4 px-5 py-5 transition hover:bg-slate-50 ${index > 0 ? "border-t border-slate-100" : ""}`}>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-sm font-black text-blue-700">{initials(otherUser.name)}</span>
                    <div className="min-w-0 flex-1"><p className="text-sm font-black text-slate-900">{otherUser.name}</p><p className="mt-1 truncate text-xs font-medium text-slate-500">{latestMessage?.content || `${room.swapRequest.teachSkill.name} ↔ ${room.swapRequest.learnSkill.name}`}</p></div>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  </Link>
                );
              })}
            </div>
          )
        )}
        </div>
      </main>
    </div>
  );
}

function RequestList({ requests, emptyTitle, emptyDescription, currentUserId, onAccept, onReject }: { requests: SwapRequest[]; emptyTitle: string; emptyDescription: string; currentUserId: string; onAccept?: (id: string) => void; onReject?: (id: string) => void }) {
  if (requests.length === 0) return <EmptyState title={emptyTitle} description={emptyDescription} icon={Inbox} />;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {requests.map((request, index) => {
        const otherUser = request.sender.id === currentUserId ? request.receiver : request.sender;
        return (
          <article key={request.id} className={`p-5 sm:p-6 ${index > 0 ? "border-t border-slate-100" : ""}`}>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-black text-blue-700">{initials(otherUser.name)}</span>
                <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="font-black text-slate-900">{otherUser.name}</h2><span className={`rounded-full px-2.5 py-1 text-[10px] font-black capitalize ${statusStyles[request.status] || "bg-slate-100 text-slate-600"}`}>{request.status}</span></div><p className="mt-1 text-sm font-bold text-slate-600">{request.teachSkill.name} <span className="text-slate-300">↔</span> {request.learnSkill.name}</p>{request.message && <p className="mt-2 line-clamp-2 text-sm font-medium text-slate-500">“{request.message}”</p>}</div>
              </div>
              <div className="flex shrink-0 gap-2">
                {request.status === "pending" && onAccept && onReject && (<><button type="button" onClick={() => onReject(request.id)} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-extrabold text-slate-600"><X className="h-4 w-4" /> Decline</button><button type="button" onClick={() => onAccept(request.id)} className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-extrabold text-white"><Check className="h-4 w-4" /> Accept</button></>)}
                {request.status === "accepted" && <span className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-50 px-4 text-sm font-extrabold text-emerald-700"><Clock3 className="h-4 w-4" /> Active swap</span>}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function EmptyState({ title, description, icon: Icon }: { title: string; description: string; icon: typeof Inbox }) {
  return (
    <div className="rounded-[26px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Icon className="h-6 w-6" /></span><h2 className="mt-5 text-xl font-black text-slate-950">{title}</h2><p className="mx-auto mt-2 max-w-md text-sm font-medium text-slate-500">{description}</p></div>
  );
}
