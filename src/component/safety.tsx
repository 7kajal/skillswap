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
      description: "Identity and profile trust indicators.",
    },
    {
      icon: Star,
      title: "Real reviews",
      description: "Feedback from completed skill exchanges.",
    },
    {
      icon: Globe2,
      title: "Global network",
      description: "Connect across cultures and locations.",
    },
    {
      icon: HeartHandshake,
      title: "Mutual value",
      description: "Both members contribute and benefit.",
    },
  ];

  return (
    <section id="safety" className="bg-white py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div className="relative min-h-[520px] overflow-hidden rounded-[38px] border border-blue-100 bg-blue-50 p-6 sm:p-10">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-300/40 blur-[90px]" />

          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-indigo-300/40 blur-[90px]" />

          <motion.div
            initial={{ opacity: 0, rotate: -3, y: 30 }}
            whileInView={{ opacity: 1, rotate: -2, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="relative mx-auto mt-9 max-w-sm rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(37,99,235,0.18)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-600">
                Verified member
              </span>
            </div>

            <h3 className="mt-7 text-2xl font-black tracking-[-0.04em] text-slate-950">
              Exchange with confidence
            </h3>

            <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
              Verification, community reviews and clear exchange expectations
              help create a safer network.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "Identity and profile verification",
                "Member ratings and reviews",
                "Private and secure messaging",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Check className="h-4 w-4" />
                  </div>

                  <span className="text-sm font-bold text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute bottom-8 left-5 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:left-10"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <MessageCircle className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-black text-slate-900">
                  Community support
                </p>

                <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
                  Here when you need us
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div>
          <SectionHeading
            align="left"
            eyebrow="Built on trust"
            title="Designed for meaningful exchange"
            description="Every member is encouraged to be clear about what they offer, what they want to learn and how they prefer to exchange."
          />

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-lg hover:shadow-blue-600/5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 font-black text-slate-950">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
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
