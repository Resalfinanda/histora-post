"use client";

import { useState, useEffect } from "react";
import { FeaturedCarousel } from "./featured-carousel";
import { TrendingSection } from "./trending-section";
import { CategoryFilter } from "./category-filter";
import { ArticleGrid } from "./article-grid";
import { NewsletterSection } from "./newsletter-section";
import { AdBanner } from "@/components/ui/ad-banner";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

const ITEMS_PER_PAGE = 7;

export function MainContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);

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

  // Filter articles by category & Reset Pagination
  useEffect(() => {
    // Reset ke halaman 1 setiap kali ganti kategori
    setCurrentPage(1);

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
  //const trendingArticles = articles.slice(0, 5);

  // Get other articles (excluding carousel articles)
  const otherArticles = filteredArticles.filter(
    (a) => !carouselArticles.find((c) => c.id === a.id),
  );

  // --- LOGIKA PAGINATION ---
  const totalPages = Math.ceil(otherArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedArticles = otherArticles.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 relative">
            {/* --- MAIN CONTENT SECTION --- */}
            <div className="lg:col-span-2 flex flex-col min-h-0">
              {/* Category Filter */}
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />

              {/* Article Grid - Menggunakan Paginated Articles */}
              <ArticleGrid
                articles={paginatedArticles}
                title="Berita Terbaru"
              />

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 inline-block mr-1" />
                  </button>
                  <span className="text-sm text-gray-600">
                    Halaman {currentPage} dari {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4 inline-block ml-1" />
                  </button>
                </div>
              )}
            </div>

            {/* --- SIDEBAR SECTION (STICKY & INDEPENDENT SCROLL) --- */}
            <div className=" lg:col-span-1 lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto lg:no-scrollbar max-h-none overflow-visible self-start pb-4 space-y-6 md:space-y-8">

              {/* Trending Section */}
              <TrendingSection />

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
