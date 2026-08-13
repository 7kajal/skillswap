import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import type { CTAProps } from "@/types/home";

export function CTA({ stats, loading, authStatus }: CTAProps) {
  const isAuthenticated = authStatus === "authenticated";

  return (
    <section id="join" className="bg-white px-5 py-20 sm:px-6 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.65 }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-blue-600 px-6 py-16 text-center text-white shadow-[0_30px_80px_rgba(37,99,235,0.25)] sm:px-10 sm:py-20"
      >
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-cyan-400/30 blur-[100px]" />

        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-indigo-700/40 blur-[100px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />

        <div className="relative mx-auto max-w-3xl">
          {/* <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white backdrop-blur">
            <Sparkles className="h-6 w-6" />
          </div> */}

          <h2 className="mt-7 text-3xl font-black leading-tight tracking-[-0.06em] sm:text-4xl md:text-5xl lg:text-6xl">
            Your next skill is already in the community.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-8 text-blue-100 sm:text-lg">
            {loading
              ? "See what people are teaching, learning and sharing with each other."
              : stats.completedSwaps > 0
                ? `${stats.peopleWhoSwapped} ${stats.peopleWhoSwapped === 1 ? "person has" : "people have"} completed ${stats.completedSwaps} ${stats.completedSwaps === 1 ? "skill swap" : "skill swaps"}, with ${stats.publishedReviews} published ${stats.publishedReviews === 1 ? "review" : "reviews"}.`
                : isAuthenticated
                  ? "Explore the community and find someone ready for your next skill exchange."
                  : "Join the community, complete your profile and start the first skill exchange."}
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            {authStatus === "loading" ? (
              <span className="h-13 w-52 animate-pulse rounded-full bg-white/20" aria-label="Loading account actions" />
            ) : (
              <Link
                href={isAuthenticated ? "/dashboard" : "/auth/register"}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-black text-blue-600 shadow-xl transition hover:-translate-y-1"
              >
                {isAuthenticated ? "Go to your dashboard" : "Create your free profile"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}

            <Link
              href="/discover"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-4 text-sm font-black text-white backdrop-blur transition hover:bg-white/15"
            >
              <Search className="h-4 w-4" />
              Browse community
            </Link>
          </div>

          {/* <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-bold text-blue-100">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4" />
              Free to join
            </span>

            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4" />
              No credit card
            </span>

            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4" />
              Global community
            </span>
          </div> */}
        </div>
      </motion.div>
    </section>
  );
}
