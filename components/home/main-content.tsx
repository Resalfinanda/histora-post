"use client";

import { useState, useEffect } from "react";
import { FeaturedCarousel } from "./featured-carousel";
import { TrendingSection } from "./trending-section";
import { CategoryFilter } from "./category-filter";
import { ArticleGrid } from "./article-grid";
import { NewsletterSection } from "./newsletter-section";
import { AdBanner } from "@/components/ui/ad-banner";

interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  category: string;
  imageUrl: string | null;
  slug: string;
  publishedDate: Date;
  isHeadline: boolean;
}

export function MainContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/articles");
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Filter articles by category
  useEffect(() => {
    if (activeCategory) {
      setFilteredArticles(
        articles.filter((article) => article.category === activeCategory),
      );
    } else {
      setFilteredArticles(articles);
    }
  }, [articles, activeCategory]);

  // Get featured articles (headlines for carousel)
  const featuredArticles = articles.filter((a) => a.isHeadline).slice(0, 5);

  // Fallback: if no headlines, use first 5 articles
  const carouselArticles =
    featuredArticles.length > 0 ? featuredArticles : articles.slice(0, 5);

  // Get unique categories
  const categories = Array.from(new Set(articles.map((a) => a.category)));

  // Get trending articles (top 5 most recent)
  const trendingArticles = articles.slice(0, 5);

  // Get other articles (excluding carousel articles)
  const otherArticles = filteredArticles.filter(
    (a) => !carouselArticles.find((c) => c.id === a.id),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {isLoading ? (
        <div className="space-y-8">
          <div className="h-80 bg-gray-200 rounded-lg animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Tidak ada artikel tersedia</p>
        </div>
      ) : (
        <>
          {/* Featured Carousel */}
          {carouselArticles.length > 0 && (
            <FeaturedCarousel articles={carouselArticles} />
          )}

          {/* Ad Banner 1 - Below Headline */}
          <div className="my-8 md:my-12">
            <AdBanner height="h-32 md:h-48" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Category Filter */}
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />

              {/* Article Grid */}
              <ArticleGrid articles={otherArticles} title="Berita Terbaru" />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6 md:space-y-8">
              {/* Trending Section */}
              <TrendingSection items={trendingArticles} />

              {/* Ad Banner 2 - Above Newsletter */}
              <AdBanner size="medium" />

              {/* Newsletter Section */}
              <NewsletterSection />

              {/* Ad Banner 3 - Below Newsletter */}
              <AdBanner size="medium" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
