"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ReviewDialogProps } from "@/types/review";
import { Star } from "lucide-react";
import { useState } from "react";

export default function ReviewDialog({
  open,
  onClose,
  otherUser,
  roomInfo,
  onSubmit,
}: ReviewDialogProps) {
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  const handleSubmit = async () => {
    if (!reviewRating || reviewSubmitting) return;
    setReviewSubmitting(true);
    try {
      await onSubmit({ rating: reviewRating, comment: reviewComment });
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] w-full sm:min-w-lg overflow-y-auto rounded-[24px] border border-slate-200 bg-white p-5 shadow-2xl sm:rounded-[28px] sm:p-7">
        <DialogHeader className="p-0 space-y-0 text-left">
          <DialogTitle className="text-xl font-black text-slate-950">
            Rate Your Experience
          </DialogTitle>
          <p className="mt-1 text-sm font-medium text-slate-500">
            with {otherUser?.name}
          </p>
        </DialogHeader>

        {/* Swap Info */}
        <div className="mt-2 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-slate-400">
              You taught
            </p>
            <p className="mt-2 font-black text-slate-900">
              {roomInfo.swapRequest.teachSkill.name}
            </p>
          </div>
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
            <Star className="h-4 w-4" />
          </div>
          <div className="rounded-2xl bg-blue-50 p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-blue-500">
              You learned
            </p>
            <p className="mt-2 font-black text-slate-900">
              {roomInfo.swapRequest.learnSkill.name}
            </p>
          </div>
        </div>

        {/* Star Rating */}
        <div className="mt-2">
          <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
            Rating
          </label>
          <div className="mt-3 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
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
              <span className="ml-3 text-sm font-bold text-slate-600">
                {reviewRating}/5
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div className="mt-2">
          <label className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
            Review
          </label>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="How was your experience? What did you learn? Would you recommend this person?"
            rows={4}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Actions */}
        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-3.5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
          >
            Skip for now
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!reviewRating || reviewSubmitting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50"
          >
            {reviewSubmitting ? "Submitting..." : "Submit Review"}
            <Star className="h-4 w-4" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
