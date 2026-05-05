"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // 1. Tambahkan ini
import { FeaturedCarousel } from "./featured-carousel";
import { TrendingSection } from "./trending-section";
import { ArticleGrid } from "./article-grid";
import { NewsletterSection } from "./newsletter-section";
import { AdBanner } from "@/components/ui/ad-banner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StickyBox from "react-sticky-box";

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
  const searchParams = useSearchParams(); // 2. Ambil parameter dari URL
  const activeCategory = searchParams.get("category"); // 3. Dapatkan kategori aktif

  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch articles
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

  // Filter articles by category from URL
  useEffect(() => {
    setCurrentPage(1); // Reset ke halaman 1 setiap ganti kategori

    if (activeCategory) {
      setFilteredArticles(
        articles.filter((article) => article.category === activeCategory)
      );
    } else {
      setFilteredArticles(articles); // Jika null (Semua), tampilkan semua
    }
  }, [articles, activeCategory]); // 4. Dependensi berubah ke activeCategory dari URL

  // Get featured articles
  const featuredArticles = articles.filter((a) => a.isHeadline).slice(0, 5);
  const carouselArticles =
    featuredArticles.length > 0 ? featuredArticles : articles.slice(0, 5);

  // Get other articles
  const otherArticles = filteredArticles.filter(
    (a) => !carouselArticles.find((c) => c.id === a.id)
  );

  // Pagination Logic
  const totalPages = Math.ceil(otherArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedArticles = otherArticles.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const mainBannerAds = [
    {
      imageUrl: "https://uyqexwhmwognigyqfegc.supabase.co/storage/v1/object/public/iklan/Banner-Pemkot-scaled.jpg",
      adLink: "https://makassarkota.go.id/",
    },
    {
      imageUrl: "https://uyqexwhmwognigyqfegc.supabase.co/storage/v1/object/public/iklan/Dispora.jpeg",
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
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
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

            {/* KOMPONEN CATEGORY FILTER DIHAPUS DARI SINI */}

            <ArticleGrid
              articles={paginatedArticles}
              title={activeCategory ? `Berita Kategori: ${activeCategory}` : "Berita Terbaru"}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-2 pt-4 ">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 inline-block mr-1" />
                </button>
                <span className="text-sm text-gray-600">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4 inline-block ml-1" />
                </button>
              </div>
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