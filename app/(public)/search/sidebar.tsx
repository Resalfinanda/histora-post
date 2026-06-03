"use client";

import StickyBox from "react-sticky-box";
import {
  TrendingSearchTopics,
  NewsletterSection,
} from "@/components/home";

import { AdBanner } from "@/components/ui/ad-banner";

export function SearchSidebar() {
  return (
    <aside className="space-y-6 md:space-y-8 h-full">
      <StickyBox offsetTop={32} offsetBottom={32}>
        <TrendingSearchTopics />
        <AdBanner size="small" placement="SIDEBAR_MIDDLE" />
        <NewsletterSection />
      </StickyBox>
    </aside>
  );
}
