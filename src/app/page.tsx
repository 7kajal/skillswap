"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type { HomeData } from "./api/home/types";
import { Community, ExchangeShowcase } from "../component/community";
import { CTA } from "../component/cta";
import { Hero, SkillsMarquee } from "../component/hero";
import { HowItWorks } from "../component/howItWorks";
import { Safety } from "../component/safety";
import { Testimonials } from "../component/testimonials";

export default function HomePage() {
  const { status } = useSession();
  const [homeData, setHomeData] = useState<HomeData>({
    members: [],
    reviews: [],
    stats: { completedSwaps: 0, peopleWhoSwapped: 0, publishedReviews: 0 },
  });
  const [loadingCommunity, setLoadingCommunity] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    fetch("/api/home", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => {
        if (active && result?.data) setHomeData(result.data);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoadingCommunity(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return (
    <main className="overflow-x-hidden bg-white text-slate-950">
      <Hero authStatus={status} />
      <SkillsMarquee />
      <HowItWorks authStatus={status} />
      <ExchangeShowcase member={homeData.members[0]} loading={loadingCommunity} authStatus={status} />
      <Community members={homeData.members} loading={loadingCommunity} />
      <Safety />
      <Testimonials reviews={homeData.reviews} loading={loadingCommunity} />
      <CTA stats={homeData.stats} loading={loadingCommunity} authStatus={status} />
    </main>
  );
}
