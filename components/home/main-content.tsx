"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FeaturedCarousel } from "./featured-carousel";
import { TrendingSection } from "./trending-section";
import { ArticleGrid } from "./article-grid";
import { NewsletterSection } from "./newsletter-section";
import { AdBanner } from "@/components/ui/ad-banner";
import StickyBox from "react-sticky-box";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

const ITEMS_PER_PAGE = 5;

export function MainContent() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => {
    setCurrentPage(1);

    if (activeCategory) {
      setFilteredArticles(
        articles.filter((article) => article.category === activeCategory),
      );
    } else {
      setFilteredArticles(articles);
    }
  }, [articles, activeCategory]);

  const featuredArticles = articles.filter((a) => a.isHeadline).slice(0, 5);
  const carouselArticles =
    featuredArticles.length > 0 ? featuredArticles : articles.slice(0, 5);

  const otherArticles = filteredArticles.filter(
    (a) => !carouselArticles.find((c) => c.id === a.id),
  );

  const totalPages = Math.ceil(otherArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedArticles = otherArticles.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Pagination controls helper function
  const getPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // First page button
    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink
            onClick={() => setCurrentPage(1)}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => setCurrentPage(i)}
            isActive={i === currentPage}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Last page button
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={() => setCurrentPage(totalPages)}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  const mainBannerAds = [
    {
      imageUrl:
        "https://uyqexwhmwognigyqfegc.supabase.co/storage/v1/object/public/iklan/Banner-Pemkot-scaled.jpg",
      adLink: "https://makassarkota.go.id/",
    },
    {
      imageUrl:
        "https://uyqexwhmwognigyqfegc.supabase.co/storage/v1/object/public/iklan/Dispora.jpeg",
      adLink: "https://dispora.makassarkota.go.id/",
    },
  ];

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 relative items-start">
          {/* MAIN CONTENT SECTION */}
          <div className="lg:col-span-2 flex flex-col min-h-0 space-y-6">
            {/* Featured Carousel (Hanya tampil jika di halaman Semua/Homepage) */}
            {!activeCategory && carouselArticles.length > 0 && (
              <FeaturedCarousel articles={carouselArticles} />
            )}

            <div className="w-full">
              <AdBanner size="large" ads={mainBannerAds} interval={5000} />
            </div>

            <ArticleGrid
              articles={paginatedArticles}
              title={
                activeCategory
                  ? `Berita Kategori: ${activeCategory}`
                  : "Berita Terbaru"
              }
            />

            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  )}

                  {getPaginationItems()}

                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}
          </div>

          {/* SIDEBAR SECTION */}
          <div className="lg:col-span-1 pb-4 h-full">
            <StickyBox offsetTop={120} offsetBottom={32}>
              <div className="space-y-6 md:space-y-8">
                <AdBanner
                  size="small"
                  imageUrl="https://uyqexwhmwognigyqfegc.supabase.co/storage/v1/object/public/iklan/Dispora.jpeg"
                  adLink="https://dispora.makassarkota.go.id/"
                />
                <TrendingSection />
                <AdBanner />
                <NewsletterSection />
                <AdBanner height="h-96" />
              </div>
            </StickyBox>
          </div>
        </div>
      )}
    </div>
  );
}