"use client";

import StickyBox from "react-sticky-box";
import {
  TrendingSection,
  TrendingSearchTopics,
  NewsletterSection,
} from "@/components/home";
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
