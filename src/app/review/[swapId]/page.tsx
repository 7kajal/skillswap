"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, ArrowLeft, Send, BadgeCheck } from "lucide-react";
import Link from "next/link";

type SwapInfo = {
  id: string;
  status: string;
  sender: { id: string; name: string; avatar: string | null };
  receiver: { id: string; name: string; avatar: string | null };
  teachSkill: { name: string };
  learnSkill: { name: string };
};

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const swapId = params.swapId as string;

  const [swap, setSwap] = useState<SwapInfo | null>(null);
  const [currentUserId, setCurrentUserId] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/swap-request").then((r) => r.json()),
      fetch("/api/profile").then((r) => r.json()),
    ]).then(([requestsData, profileData]) => {
      setCurrentUserId(profileData.id);
      const all = [...(requestsData.sent || []), ...(requestsData.received || [])];
      const found = all.find((r: SwapInfo) => r.id === swapId);
      setSwap(found || null);
      setLoading(false);
    });
  }, [swapId]);

  useEffect(() => {
    if (!swap) return;
    const reviewerId = swap.sender.id === currentUserId ? currentUserId : currentUserId;
    const reviewedId = swap.sender.id === currentUserId ? swap.receiver.id : swap.sender.id;
    fetch(`/api/review?swapRequestId=${swapId}&reviewerId=${reviewerId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.id) setAlreadyReviewed(true);
      })
      .catch(() => {});
  }, [swap, swapId, currentUserId]);

  const handleSubmit = async () => {
    if (!rating || !reviewedId) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          swapRequestId: swapId,
          reviewedId,
          rating,
          comment: comment.trim() || null,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!swap) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-black text-slate-950">Swap not found</h1>
          <Link href="/dashboard" className="mt-4 inline-block text-sm font-bold text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!swap) return null;

  const reviewedId = swap.sender.id === currentUserId ? swap.receiver.id : swap.sender.id;
  const otherUser = swap.sender.id === currentUserId ? swap.receiver : swap.sender;

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-[28px] border border-slate-200 bg-white p-12 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <Star className="h-8 w-8 fill-emerald-500" />
          </div>
          <h1 className="mt-6 text-2xl font-black text-slate-950">Review Submitted!</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">Thank you for your feedback. Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  if (alreadyReviewed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-[28px] border border-slate-200 bg-white p-12 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <Star className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-2xl font-black text-slate-950">Already Reviewed</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">You have already reviewed this swap exchange.</p>
          <Link href="/dashboard" className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-blue-700">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-2xl px-5 py-5 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-black text-slate-950">Rate Your Experience</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Share your feedback about exchanging skills with{" "}
            <span className="font-bold text-slate-900">{otherUser.name}</span>
          </p>

          {/* Swap Info */}
          <div className="mt-6 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-slate-400">You taught</p>
              <p className="mt-2 font-black text-slate-900">{swap.teachSkill.name}</p>
            </div>
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
              <Send className="h-4 w-4" />
            </div>
            <div className="rounded-2xl bg-blue-50 p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-blue-500">You learned</p>
              <p className="mt-2 font-black text-slate-900">{swap.learnSkill.name}</p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="mt-8">
            <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">Rating</label>
            <div className="mt-3 flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition hover:scale-110"
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-3 text-sm font-bold text-slate-600">
                  {rating}/5
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div className="mt-6">
            <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was your experience? What did you learn? Would you recommend this person?"
              rows={4}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!rating || submitting}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
