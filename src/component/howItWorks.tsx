import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { steps } from "./constant/static";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-slate-100 py-24 text-blue-600 sm:py-28"
    >
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full border-blue-100 bg-blue-50 blur-[90px]" />

      <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-indigo-300/40 blur-[90px]" />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:px-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-400">
            How it works
          </p>

          <h2 className="mt-4 max-w-lg text-4xl font-black text-black leading-tight tracking-[-0.055em] sm:text-5xl">
            Exchange real value without money.
          </h2>

          <p className="mt-5 max-w-lg text-base font-medium leading-8 text-slate-400">
            No subscriptions, complicated pricing or classroom pressure. Just
            people helping each other learn and grow.
          </p>

          <div className="mt-9 rounded-[28px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                <Zap className="h-5 w-5 fill-current" />
              </div>

              <div>
                <p className="font-black">Every useful skill has value</p>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  From coding and strategy to photography, cooking and
                  communication.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {steps.map((step, index) => (
            <motion.article
              key={step.number}
              initial={{ opacity: 0, x: 35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: 0.55,
                delay: index * 0.12,
              }}
              className="group rounded-[28px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur transition hover:border-blue-500/40 hover:bg-blue-500/[0.08] sm:flex sm:items-center sm:gap-6"
            >
              <div className="mb-5 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-600/20 sm:mb-0">
                {step.number}
              </div>

              <div>
                <h3 className="text-xl font-black tracking-[-0.025em]">
                  {step.title}
                </h3>

                <p className="mt-2 max-w-xl text-sm font-medium leading-7 text-slate-400">
                  {step.description}
                </p>

                {/* <div className="mt-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.13em] text-blue-400">
                  <Check className="h-4 w-4" />
                  Simple and flexible
                </div> */}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
