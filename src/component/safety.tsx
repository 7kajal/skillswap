import { motion } from "framer-motion";
import {
  Check,
  Globe2,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  Star,
} from "lucide-react";
import { SectionHeading } from "./sectionHeading";

export function Safety() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Verified members",
      description: "Verified ID for trusted exchanges.",
      color:
        "border-slate-200 hover:border-blue-300 hover:shadow-blue-600/5 hover:bg-blue-50/10",
      badgeColor: "bg-blue-50 text-blue-600",
    },
    {
      icon: Star,
      title: "Real reviews",
      description: "Genuine ratings from real sessions.",
      color:
        "border-slate-200 hover:border-blue-300 hover:shadow-amber-600/5 hover:bg-blue-50/10",
      badgeColor: "bg-amber-50 text-amber-600",
    },
    {
      icon: Globe2,
      title: "Global network",
      description: "Connect across time zones.",
      color:
        "border-slate-200 hover:border-blue-300 hover:shadow-purple-600/5 hover:bg-blue-50/10",
      badgeColor: "bg-purple-50 text-purple-600",
    },
    {
      icon: HeartHandshake,
      title: "Mutual value",
      description: "1-on-1 swaps, zero extra fees.",
      color:
        "border-slate-200 hover:border-blue-300 hover:shadow-emerald-600/5 hover:bg-blue-50/10",
      badgeColor: "bg-emerald-50 text-emerald-600",
    },
  ];
  return (
    <section
      id="safety"
      className="bg-white py-24 sm:py-28 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-0 h-96 w-96 rounded-full bg-slate-50 blur-[130px] pointer-events-none" />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        {/* Left Side: Mockup Interface matching the image design */}
        <div className="relative min-h-[580px] overflow-hidden rounded-[38px] bg-gradient-to-b from-blue-100/60 via-blue-50/40 to-blue-100/40 p-6 sm:p-12 flex items-center justify-center border border-blue-100/50">
          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, rotate: -2, y: 15 }}
            whileInView={{ opacity: 1, rotate: -2, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative w-full max-w-md rounded-[32px] bg-white p-7 sm:p-9 shadow-[0_20px_50px_rgba(37,99,235,0.08)] border border-slate-100/80"
          >
            {/* Top Bar: Blue Shield Badge & Verified Pill */}
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                <ShieldCheck className="h-7 w-7" />
              </div>

              <span className="rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-600">
                Verified member
              </span>
            </div>

            {/* Title & Description */}
            <div className="mt-7">
              <h3 className="text-2xl font-black text-slate-950 tracking-tight">
                Exchange with confidence
              </h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
                Verification, community reviews and clear exchange expectations
                help create a safer network.
              </p>
            </div>

            {/* Checklist items */}
            <div className="mt-7 space-y-3">
              <div className="flex items-center gap-3.5 rounded-2xl bg-slate-50/80 p-3.5 text-sm font-bold text-slate-800">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
                <span>Identity and profile verification</span>
              </div>

              <div className="flex items-center gap-3.5 rounded-2xl bg-slate-50/80 p-3.5 text-sm font-bold text-slate-800">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
                <span>Member ratings and reviews</span>
              </div>

              <div className="flex items-center gap-3.5 rounded-2xl bg-slate-50/80 p-3.5 text-sm font-bold text-slate-800">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
                <span>Private and secure messaging</span>
              </div>
            </div>
          </motion.div>

          {/* Floating Community Support Badge (Bottom-Left) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute left-4 bottom-6 sm:left-8 sm:bottom-10 z-10 flex items-center gap-3.5 rounded-2xl bg-white p-4 shadow-[0_15px_35px_rgba(0,0,0,0.08)] border border-slate-100"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">
                Community support
              </h4>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                Here when you need us
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Heading & Grid */}
        <div>
          <SectionHeading
            align="left"
            eyebrow="Built on trust"
            title="Designed for meaningful exchanges."
            description="Our custom validation mechanics ensure every member is clear about what they offer, what they want to learn, and how they behave."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className={`rounded-[24px] border bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${feature.color}`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${feature.badgeColor}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 font-black text-slate-950 text-sm">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-500">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
