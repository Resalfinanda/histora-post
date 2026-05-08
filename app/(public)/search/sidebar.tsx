"use client";

import StickyBox from "react-sticky-box";
import { TrendingSection } from "@/components/home/trending-section";
import { TrendingSearchTopics } from "@/components/home/trending-search-topics";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { AdBanner } from "@/components/ui/ad-banner";

export function SearchSidebar() {
  return (
    <aside className="space-y-6 md:space-y-8 h-full">
      <StickyBox offsetTop={32} offsetBottom={32}>
        <TrendingSection />
        <AdBanner size="small" placement="SIDEBAR_MIDDLE" />
        <TrendingSearchTopics />
        <AdBanner height="h-96" placement="SIDEBAR_BOTTOM" />
        <NewsletterSection />
      </StickyBox>
    </aside>
  );
}
