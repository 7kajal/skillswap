"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Send,
  Paperclip,
  CheckCircle,
  BadgeCheck,
  ArrowLeft,
  Star,
  X,
} from "lucide-react";
import Link from "next/link";

type Message = {
  id: string;
  content: string;
  fileUrl: string | null;
  createdAt: string;
  sender: { id: string; name: string; avatar: string | null };
};

type RoomInfo = {
  id: string;
  swapRequest: {
    id: string;
    sender: { id: string; name: string; avatar: string | null };
    receiver: { id: string; name: string; avatar: string | null };
    teachSkill: { name: string };
    learnSkill: { name: string };
    status: string;
  };
};

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function shouldShowDateSeparator(messages: Message[], index: number) {
  if (index === 0) return true;
  const prev = new Date(messages[index - 1].createdAt);
  const curr = new Date(messages[index].createdAt);
  return prev.toDateString() !== curr.toDateString();
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!roomId) return;

    Promise.all([
      fetch(`/api/chat/${roomId}/messages`).then((r) => r.json()),
      fetch("/api/profile").then((r) => r.json()),
      fetch("/api/chat/rooms").then((r) => r.json()),
    ]).then(([messagesRes, profileRes, roomsRes]) => {
      setMessages(Array.isArray(messagesRes.data) ? messagesRes.data : []);
      setCurrentUserId(profileRes.data.id);

      const rooms = Array.isArray(roomsRes.data) ? roomsRes.data : [];
      const currentRoom = rooms.find((r: RoomInfo) => r.id === roomId);
      if (currentRoom) {
        setRoomInfo(currentRoom);
      }
      setLoading(false);
    });
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!roomId || !currentUserId) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/chat/${roomId}/messages`);
        if (res.ok) {
          const json = await res.json();
          const data = json.data;
          if (Array.isArray(data)) {
            setMessages((prev) => {
              if (prev.length === 0) return data;
              const lastPrev = prev[prev.length - 1];
              const lastNew = data[data.length - 1];
              if (lastPrev.id !== lastNew.id) return data;
              return prev;
            });
          }
        }
      } catch {
        // ignore polling errors
      }
    }, 4000);

    return () => clearInterval(pollInterval);
  }, [roomId, currentUserId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/chat/${roomId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage.trim() }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setMessages((prev) => [...prev, json.data]);
        setNewMessage("");
      }
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  const markComplete = async () => {
    if (!roomInfo?.swapRequest?.id) return;
    setCompleting(true);
    try {
      const res = await fetch(`/api/swap-request/${roomInfo.swapRequest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      const json = await res.json();
      if (json.success) {
        setRoomInfo((prev) =>
          prev
            ? {
                ...prev,
                swapRequest: { ...prev.swapRequest, status: "completed" },
              }
            : prev
        );
        setShowReviewModal(true);
        setReviewRating(0);
        setReviewComment("");
        setReviewSubmitted(false);
      }
    } catch {
      // ignore
    } finally {
      setCompleting(false);
    }
  };

  const submitReview = async () => {
    if (!roomInfo?.swapRequest?.id || !reviewRating) return;
    const reviewedId = roomInfo.swapRequest.sender.id === currentUserId
      ? roomInfo.swapRequest.receiver.id
      : roomInfo.swapRequest.sender.id;
    setReviewSubmitting(true);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          swapRequestId: roomInfo.swapRequest.id,
          reviewedId,
          rating: reviewRating,
          comment: reviewComment.trim() || null,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setReviewSubmitted(true);
      }
    } catch {
      // ignore
    } finally {
      setReviewSubmitting(false);
    }
  };

  const otherUser =
    roomInfo?.swapRequest?.sender.id === currentUserId
      ? roomInfo?.swapRequest.receiver
      : roomInfo?.swapRequest.sender;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-65px)] flex-col bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-5 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            {otherUser && (
              <div className="flex items-center gap-3">
                {otherUser.avatar ? (
                  <img
                    src={otherUser.avatar}
                    alt={otherUser.name}
                    className="h-10 w-10 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xs font-black text-white">
                    {otherUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1">
                    <h2 className="text-sm font-black text-slate-950">
                      {otherUser.name}
                    </h2>
                    <BadgeCheck className="h-3.5 w-3.5 fill-blue-600 text-white" />
                  </div>
                  {roomInfo?.swapRequest && (
                    <p className="text-[11px] font-bold text-blue-600">
                      {roomInfo.swapRequest.teachSkill.name} ↔{" "}
                      {roomInfo.swapRequest.learnSkill.name}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {roomInfo?.swapRequest?.status === "accepted" && (
              <button
                onClick={markComplete}
                disabled={completing}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-extrabold text-emerald-600 transition hover:bg-emerald-100 disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" />
                {completing ? "Completing..." : "Mark Complete"}
              </button>
            )}

            {roomInfo?.swapRequest?.status === "completed" && (
              <button
                onClick={() => {
                  setShowReviewModal(true);
                  setReviewRating(0);
                  setReviewComment("");
                  setReviewSubmitted(false);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-xs font-extrabold text-amber-600 transition hover:bg-amber-100"
              >
                <Star className="h-4 w-4" />
                Leave a Review
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="mx-auto max-w-4xl space-y-1">
          {messages.length === 0 && (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <p className="text-sm font-bold text-slate-500">
                No messages yet. Start the conversation!
              </p>
            </div>
          )}

          {messages.map((msg, index) => {
            const isOwn = msg.sender.id === currentUserId;
            const initials = msg.sender.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2);

            const showDate = shouldShowDateSeparator(messages, index);
            const prevMsg = index > 0 ? messages[index - 1] : null;
            const showSenderLabel =
              !prevMsg ||
              prevMsg.sender.id !== msg.sender.id ||
              showDate;

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="flex items-center justify-center py-4">
                    <div className="rounded-full bg-slate-200 px-4 py-1.5 text-[11px] font-bold text-slate-500">
                      {formatDateLabel(msg.createdAt)}
                    </div>
                  </div>
                )}

                <div
                  className={`flex ${isOwn ? "justify-end" : "justify-start"} ${showSenderLabel && !showDate ? "mt-4" : "mt-0.5"}`}
                >
                  <div
                    className={`flex max-w-[70%] items-end gap-2.5 ${isOwn ? "flex-row-reverse" : ""}`}
                  >
                    {!isOwn &&
                      (showSenderLabel ? (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-black text-blue-700">
                          {initials}
                        </div>
                      ) : (
                        <div className="h-8 w-8 shrink-0" />
                      ))}
                    <div>
                      {!isOwn && showSenderLabel && (
                        <p className="mb-1 text-[11px] font-bold text-slate-400">
                          {msg.sender.name}
                        </p>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-sm font-medium leading-relaxed ${
                          isOwn
                            ? "rounded-br-md bg-blue-600 text-white shadow-sm shadow-blue-600/10"
                            : "rounded-bl-md border border-slate-200 bg-white text-slate-900"
                        }`}
                      >
                        {msg.content}
                      </div>
                      {showSenderLabel && (
                        <p
                          className={`mt-1 text-[10px] text-slate-400 ${isOwn ? "text-right" : ""}`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Type a message..."
            className="h-12 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-40"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
      {/* Review Modal */}
      {showReviewModal && roomInfo?.swapRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {reviewSubmitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <Star className="h-8 w-8 fill-emerald-500" />
                </div>
                <h2 className="mt-6 text-xl font-black text-slate-950">Review Submitted!</h2>
                <p className="mt-2 text-sm font-medium text-slate-500">Thank you for your feedback.</p>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-950">Rate Your Experience</h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      with {otherUser?.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Swap Info */}
                <div className="mt-6 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-slate-400">You taught</p>
                    <p className="mt-2 font-black text-slate-900">{roomInfo.swapRequest.teachSkill.name}</p>
                  </div>
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                    <Star className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl bg-blue-50 p-4">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-blue-500">You learned</p>
                    <p className="mt-2 font-black text-slate-900">{roomInfo.swapRequest.learnSkill.name}</p>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="mt-8">
                  <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">Rating</label>
                  <div className="mt-3 flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setReviewHoverRating(star)}
                        onMouseLeave={() => setReviewHoverRating(0)}
                        onClick={() => setReviewRating(star)}
                        className="transition hover:scale-110"
                      >
                        <Star
                          className={`h-10 w-10 ${
                            star <= (reviewHoverRating || reviewRating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      </button>
                    ))}
                    {reviewRating > 0 && (
                      <span className="ml-3 text-sm font-bold text-slate-600">{reviewRating}/5</span>
                    )}
                  </div>
                </div>

                {/* Comment */}
                <div className="mt-6">
                  <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">Review</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="How was your experience? What did you learn? Would you recommend this person?"
                    rows={4}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 rounded-xl border border-slate-200 py-3.5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
                  >
                    Skip for now
                  </button>
                  <button
                    onClick={submitReview}
                    disabled={!reviewRating || reviewSubmitting}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50"
                  >
                    {reviewSubmitting ? "Submitting..." : "Submit Review"}
                    <Star className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
