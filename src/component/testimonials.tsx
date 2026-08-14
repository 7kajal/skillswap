import { useState } from "react";
import { Star } from "lucide-react";
import { SectionHeading } from "./sectionHeading";
import { motion } from "framer-motion";
import type { TestimonialsProps } from "@/types/home";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ReviewCard({
  review,
  index,
}: {
  review: TestimonialsProps["reviews"][number];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.comment.length > 80;

  return (
    <motion.article
      key={review.id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
      }}
      className="group relative flex w-[280px] sm:w-[320px] lg:w-[360px] shrink-0 snap-start self-stretch flex-col justify-between rounded-[32px] border border-slate-200 bg-white p-6 sm:p-7 shadow-[0_12px_35px_rgba(15,23,42,0.04)] transition-all duration-300 hover:border-blue-200 hover:shadow-[0_24px_55px_rgba(37,99,235,0.08)] hover:-translate-y-1"
    >
      <div className="absolute right-7 top-6 text-5xl font-black text-slate-300/80 pointer-events-none select-none font-serif">
        &ldquo;
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, starIndex) => (
              <Star
                key={starIndex}
                className={`h-4.5 w-4.5 transition-all duration-300 ${
                  starIndex < review.rating
                    ? "fill-amber-400 text-amber-400 group-hover:scale-110 drop-shadow-[0_0_4px_rgba(245,158,11,0.2)]"
                    : "text-slate-200"
                }`}
              />
            ))}
          </div>

          <blockquote
            className={`mt-5 [overflow-wrap:anywhere] tracking-tight text-slate-800 text-base font-semibold leading-relaxed ${
              !expanded && isLong ? "line-clamp-2" : ""
            }`}
          >
            {review.comment}
          </blockquote>
        </div>

        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-left text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            {expanded ? "Show less" : "View more"}
          </button>
        )}
      </div>

      <div className="mt-5 flex items-center gap-3 border-t border-slate-200 pt-4">
        {review.reviewer.avatar ? (
          <div className="h-10 w-10 shrink-0 rounded-xl border border-slate-200 overflow-hidden ring-2 ring-slate-200">
            <img
              src={review.reviewer.avatar}
              alt={review.reviewer.name}
              className="h-full w-full object-cover rounded-xl border border-slate-200"
            />
          </div>
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-black text-blue-600">
            {initials(review.reviewer.name)}
          </div>
        )}

        <div className="min-w-0">
          <p className="text-sm font-black text-slate-900 truncate">
            {review.reviewer.name}
          </p>
          <p className="mt-0.5 text-xs font-semibold text-slate-400 truncate">
            Swapped with {review.reviewed.name}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

export function Testimonials({ reviews, loading }: TestimonialsProps) {
  return (
    <section className="bg-slate-50 py-24 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Community stories"
          title="Better when we learn together"
          description="People are exchanging practical skills, building confidence and creating meaningful professional connections."
        />

        {loading ? (
          <div className="mt-14 flex items-stretch gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-none">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-64 w-[280px] sm:w-[320px] lg:w-[360px] shrink-0 snap-start animate-pulse rounded-[28px] border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="mt-14 rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <h3 className="text-xl font-black text-slate-950">
              No community reviews yet
            </h3>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Written reviews from completed skill swaps will appear here.
            </p>
          </div>
        ) : (
          <div
            className={`mt-14 flex items-stretch gap-6 overflow-x-auto pb-6 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              reviews.length < 4
                ? "justify-start sm:justify-center"
                : "justify-start"
            }`}
          >
            {reviews.map((review, index) => (
              <ReviewCard key={review.id} review={review} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
