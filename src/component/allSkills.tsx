import { ArrowRight, ChevronRight, Users } from "lucide-react";
import { SectionHeading } from "./sectionHeading";
import { categories } from "./constant/static";
import { motion } from "framer-motion";

export function Skills() {
  return (
    <section id="skills" className="bg-slate-50 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            align="left"
            eyebrow="Explore the network"
            title="Skills worth sharing"
            description="Discover experienced people ready to exchange creative, technical and practical knowledge."
          />

          <a
            href="#community"
            className="group inline-flex w-fit items-center gap-2 text-sm font-black text-blue-600"
          >
            Browse all skills
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.a
                key={category.title}
                href="#community"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.06,
                }}
                whileHover={{ y: -7 }}
                className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_35px_rgba(15,23,42,0.04)] transition-shadow hover:border-blue-200 hover:shadow-[0_22px_55px_rgba(37,99,235,0.12)]"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-13 w-13 items-center justify-center rounded-2xl ${category.iconClassName}`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>

                <h3 className="mt-7 text-xl font-black tracking-[-0.035em] text-slate-950">
                  {category.title}
                </h3>

                <p className="mt-2 text-sm font-medium text-slate-500">
                  {category.description}
                </p>

                <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs font-bold text-slate-400">
                  <Users className="h-4 w-4" />
                  {category.members}
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
