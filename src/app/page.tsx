"use client";

import { Community, ExchangeShowcase } from "../component/community";
import { CTA } from "../component/cta";
import { Hero, SkillsMarquee } from "../component/hero";
import { HowItWorks } from "../component/howItWorks";
import { Safety } from "../component/safety";
import { Testimonials } from "../component/testimonials";

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-white text-slate-950">
      <Hero />
      <SkillsMarquee />
      <HowItWorks />
      <ExchangeShowcase />
      <Community />
      <Safety />
      <Testimonials />
      <CTA />
    </main>
  );
}
