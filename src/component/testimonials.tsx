import { Star } from "lucide-react";
import { SectionHeading } from "./sectionHeading";
import { motion } from "framer-motion";
import type { HomeReview } from "@/app/api/home/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Testimonials({ reviews, loading }: { reviews: HomeReview[]; loading: boolean }) {
  const reviewGridClass =
    reviews.length === 1
      ? "mx-auto max-w-xl grid-cols-1"
      : reviews.length === 2
        ? "mx-auto max-w-4xl md:grid-cols-2"
        : "lg:grid-cols-3";

  return (
    <section className="bg-slate-50 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Community stories"
          title="Better when we learn together"
          description="People are exchanging practical skills, building confidence and creating meaningful professional connections."
        />

        {loading ? (
          <div className="mt-14 grid gap-5 lg:grid-cols-3" aria-label="Loading community reviews">
            {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-80 animate-pulse rounded-[28px] border border-slate-200 bg-white" />)}
          </div>
        ) : reviews.length === 0 ? (
          <div className="mt-14 rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <h3 className="text-xl font-black text-slate-950">No community reviews yet</h3>
            <p className="mt-2 text-sm font-medium text-slate-500">Written reviews from completed skill swaps will appear here.</p>
          </div>
        ) : (
          <div className={`mt-14 grid gap-5 ${reviewGridClass}`}>
          {reviews.map((review, index) => (
            <motion.article
              key={review.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="flex min-h-[320px] min-w-0 flex-col rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_12px_35px_rgba(15,23,42,0.05)] transition hover:border-blue-200 hover:shadow-[0_20px_50px_rgba(37,99,235,0.09)]"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    className={`h-4 w-4 ${starIndex < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                  />
                ))}
              </div>

              <blockquote className="mt-7 flex-1 [overflow-wrap:anywhere] text-lg font-bold leading-8 tracking-[-0.02em] text-slate-800">
                “{review.comment}”
              </blockquote>

              <div className="mt-8 flex items-center gap-3 border-t border-slate-100 pt-5">
                {review.reviewer.avatar ? (
                  <img src={review.reviewer.avatar} alt={review.reviewer.name} className="h-11 w-11 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xs font-black text-blue-600">{initials(review.reviewer.name)}</div>
                )}

                <div>
                  <p className="text-sm font-black text-slate-900">
                    {review.reviewer.name}
                  </p>

                  <p className="mt-0.5 text-xs font-semibold text-slate-500">
                    Review for {review.reviewed.name}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
          </div>
        )}
      </div>
    </section>
  );
}
