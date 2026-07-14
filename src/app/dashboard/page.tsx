"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Clock,
  MessageCircle,
  Star,
  X,
  Sparkles,
  User,
  MapPin,
  Send,
  Inbox,
  Mail,
} from "lucide-react";
import Link from "next/link";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  rating: number;
  reviewCount: number;
  completedSwaps: number;
  userSkills: { skill: { name: string }; type: string }[];
  badges: { badge: { name: string; icon: string } }[];
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sent, setSent] = useState<SwapRequest[]>([]);
  const [received, setReceived] = useState<SwapRequest[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [activeTab, setActiveTab] = useState<"received" | "sent" | "chats">("received");
  const [loading, setLoading] = useState(true);
  const [reviewedSwaps, setReviewedSwaps] = useState<Set<string>>(new Set());

  useEffect(() => {
    Promise.all([
      fetch("/api/profile").then((r) => r.json()),
      fetch("/api/swap-request").then((r) => r.json()),
      fetch("/api/chat/rooms").then((r) => r.json()),
    ]).then(([profileData, requestsData, roomsData]) => {
      setProfile(profileData);
      setSent(requestsData.sent || []);
      setReceived(requestsData.received || []);
      setChatRooms(Array.isArray(roomsData) ? roomsData : []);
      setLoading(false);

      const completed = [
        ...(requestsData.sent || []),
        ...(requestsData.received || []),
      ].filter((r: SwapRequest) => r.status === "completed");

      if (completed.length > 0) {
        Promise.all(
          completed.map((r: SwapRequest) =>
            fetch(`/api/review?swapRequestId=${r.id}&reviewerId=${profileData.id}`)
              .then((res) => res.json())
              .then((data) => ({ id: r.id, reviewed: data && data.id }))
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

    setReceived((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    setSent((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );

    if (status === "accepted") {
      const roomsRes = await fetch("/api/chat/rooms");
      const roomsData = await roomsRes.json();
      setChatRooms(Array.isArray(roomsData) ? roomsData : []);
    }
  };

  const tabs = [
    { id: "received" as const, label: "Received", icon: Inbox, count: received.filter((r) => r.status === "pending").length },
    { id: "sent" as const, label: "Sent", icon: Send, count: sent.length },
    { id: "chats" as const, label: "Chats", icon: MessageCircle, count: chatRooms.length },
  ];

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

  return (
    <div className="bg-slate-50">
      {/* Profile Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              {profile?.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="h-20 w-20 rounded-2xl object-cover" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-black text-white">
                  {profile?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-950">{profile?.name}</h1>
                  <BadgeCheck className="h-5 w-5 fill-blue-600 text-white" />
                </div>
                {profile?.location && (
                  <p className="mt-1 flex items-center gap-1 text-sm font-medium text-slate-500">
                    <MapPin className="h-4 w-4" /> {profile.location}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-4">
                  <span className="flex items-center gap-1 text-sm font-bold text-slate-700">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {profile?.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-slate-500">{profile?.reviewCount} reviews</span>
                  <span className="text-sm text-slate-500">{profile?.completedSwaps} exchanges</span>
                </div>
              </div>
            </div>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Discover
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Badges */}
          {profile?.badges && profile.badges.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {profile.badges.map((b) => (
                <span
                  key={b.badge.name}
                  className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-600"
                >
                  {b.badge.icon} {b.badge.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 lg:px-8">
        {/* Profile Incomplete Banner */}
        {profile && (!profile.bio || !profile.location || profile.userSkills.length === 0) && (
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
                {tab.count > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-100 px-1.5 text-[10px] font-extrabold text-blue-600">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === "received" && (
            <div className="space-y-4">
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
            <div className="space-y-4">
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
            <div className="space-y-4">
              {chatRooms.length === 0 ? (
                <EmptyState icon={MessageCircle} title="No active chats" description="Once a skill swap request is accepted, a chat room will be created here." />
              ) : (
                chatRooms.map((room) => {
                  const other = profile?.id === room.swapRequest.sender.id
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
