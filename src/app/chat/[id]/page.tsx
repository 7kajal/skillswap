"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Send,
  Paperclip,
  CheckCircle,
  BadgeCheck,
  MapPin,
} from "lucide-react";

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
      await fetch(`/api/swap-request/${roomInfo.swapRequest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      setRoomInfo((prev) =>
        prev
          ? {
              ...prev,
              swapRequest: { ...prev.swapRequest, status: "completed" },
            }
          : prev
      );
    } catch {
      // ignore
    } finally {
      setCompleting(false);
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
      <div className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-3">
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
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-4 py-2.5 text-xs font-extrabold text-blue-600">
              <CheckCircle className="h-4 w-4" />
              Completed
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.length === 0 && (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <p className="text-sm font-bold text-slate-500">
                No messages yet. Start the conversation!
              </p>
            </div>
          )}

          {messages.map((msg) => {
            const isOwn = msg.sender.id === currentUserId;
            const initials = msg.sender.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2);

            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-[75%] items-end gap-2 ${isOwn ? "flex-row-reverse" : ""}`}
                >
                  {!isOwn && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-black text-slate-600">
                      {initials}
                    </div>
                  )}
                  <div>
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm font-semibold ${isOwn ? "rounded-br-md bg-blue-600 text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-900"}`}
                    >
                      {msg.content}
                    </div>
                    <p
                      className={`mt-1 text-[10px] text-slate-400 ${isOwn ? "text-right" : ""}`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
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
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Type a message..."
            className="h-12 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
