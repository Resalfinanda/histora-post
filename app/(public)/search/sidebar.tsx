'use client'; 

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
        <AdBanner
          size="small"
          imageUrl="https://uyqexwhmwognigyqfegc.supabase.co/storage/v1/object/public/iklan/Dispora.jpeg"
          adLink="https://dispora.makassarkota.go.id/"
        />
        <TrendingSearchTopics />
        <AdBanner
          size="small"
          imageUrl="https://uyqexwhmwognigyqfegc.supabase.co/storage/v1/object/public/iklan/Banner-Pemkot-scaled.jpg"
          adLink="https://makassarkota.go.id/"
        />
        <NewsletterSection />
      </StickyBox>
    </aside>
  );
}