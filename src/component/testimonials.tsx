import { Star } from "lucide-react";
import { testimonials } from "./constant/static";
import { SectionHeading } from "./sectionHeading";
import { motion } from "framer-motion";

export function Testimonials() {
  return (
    <section className="bg-slate-50 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Community stories"
          title="Better when we learn together"
          description="People are exchanging practical skills, building confidence and creating meaningful professional connections."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="flex min-h-[320px] flex-col rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_12px_35px_rgba(15,23,42,0.05)] transition hover:border-blue-200 hover:shadow-[0_20px_50px_rgba(37,99,235,0.09)]"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              <blockquote className="mt-7 flex-1 text-lg font-bold leading-8 tracking-[-0.02em] text-slate-800">
                “{testimonial.quote}”
              </blockquote>

              <div className="mt-8 flex items-center gap-3 border-t border-slate-100 pt-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xs font-black text-blue-600">
                  {testimonial.initials}
                </div>

                <div>
                  <p className="text-sm font-black text-slate-900">
                    {testimonial.name}
                  </p>

                  <p className="mt-0.5 text-xs font-semibold text-slate-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
