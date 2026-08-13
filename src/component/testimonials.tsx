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

export function Testimonials({ reviews, loading }: TestimonialsProps) {
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
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-64 animate-pulse rounded-[28px] border border-slate-200 bg-white" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="mt-14 rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <h3 className="text-xl font-black text-slate-950">No community reviews yet</h3>
            <p className="mt-2 text-sm font-medium text-slate-500">Written reviews from completed skill swaps will appear here.</p>
          </div>
        ) : (
          <div className={`mt-14 grid gap-6 ${reviewGridClass}`}>
            {reviews.map((review, index) => {
              // Highlight short reviews with larger typography
              const isShort = review.comment.length < 75;

              return (
                <motion.article
                  key={review.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  className="group relative flex h-full flex-col justify-between rounded-[32px] border border-slate-200 bg-white p-7 sm:p-8 shadow-[0_12px_35px_rgba(15,23,42,0.04)] transition-all duration-300 hover:border-blue-200 hover:shadow-[0_24px_55px_rgba(37,99,235,0.08)] hover:-translate-y-1"
                >
                  {/* Background Quote Mark */}
                  <div className="absolute right-7 top-6 text-5xl font-black text-slate-300/80 pointer-events-none select-none font-serif">
                    “
                  </div>

                  {/* Top Content (Stars + Comment) */}
                  <div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className={`h-4.5 w-4.5 transition-all duration-300 ${starIndex < review.rating
                            ? "fill-amber-400 text-amber-400 group-hover:scale-110 drop-shadow-[0_0_4px_rgba(245,158,11,0.2)]"
                            : "text-slate-200"
                            }`}
                        />
                      ))}
                    </div>

                    <blockquote
                      className={`mt-5 [overflow-wrap:anywhere] tracking-tight text-slate-800 ${isShort
                        ? "text-lg font-bold leading-snug"
                        : "text-base font-semibold leading-relaxed"
                        }`}
                    >
                      {review.comment}
                    </blockquote>
                  </div>

                  {/* Bottom Content (User Info) */}
                  <div className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-5">
                    {review.reviewer.avatar ? (
                      <div className="h-11 w-11 shrink-0 rounded-xl border border-slate-200 overflow-hidden ring-2 ring-slate-200">
                        <img
                          src={review.reviewer.avatar}
                          alt={review.reviewer.name}
                          className="h-full w-full object-cover rounded-xl border border-slate-200"
                        />
                      </div>
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-black text-blue-600">
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
            })}
          </div>
        )}
      </div>
    </section>
  );
}
