"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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

const mainBannerAds = [
  {
    id: "pemkot-1",
    imageUrl:
      "https://uyqexwhmwognigyqfegc.supabase.co/storage/v1/object/public/iklan/Banner-Pemkot-scaled.jpg",
    adLink: "https://makassarkota.go.id/",
  },
  {
    id: "dispora-1",
    imageUrl:
      "https://uyqexwhmwognigyqfegc.supabase.co/storage/v1/object/public/iklan/Dispora.jpeg",
    adLink: "https://dispora.makassarkota.go.id/",
  },
];

export function MainContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeCategory = searchParams.get("category");
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  const handleNavigate = (
    e: React.MouseEvent<HTMLAnchorElement>,
    pageNumber: number,
  ) => {
    e.preventDefault();
    const newUrl = createPageURL(pageNumber);
    router.push(newUrl, { scroll: true });
  };

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: ITEMS_PER_PAGE.toString(),
          ...(activeCategory && { category: activeCategory }),
        });

        const response = await fetch(`/api/articles?${queryParams.toString()}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          const allArticles: Article[] = data;
          const filtered = activeCategory
            ? allArticles.filter((a) => a.category === activeCategory)
            : allArticles;

          const headlines = allArticles.filter((a) => a.isHeadline).slice(0, 5);
          setFeaturedArticles(headlines);

          const carouselIds = headlines.map((h) => h.id);
          const otherArticles = filtered.filter(
            (a) => !carouselIds.includes(a.id),
          );

          setTotalPages(Math.ceil(otherArticles.length / ITEMS_PER_PAGE));
          const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
          setArticles(
            otherArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE),
          );
        } else {
          setArticles(data.articles || []);
          setTotalPages(data.totalPages || 1);
          if (data.featuredArticles) {
            setFeaturedArticles(data.featuredArticles);
          }
        }
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage, activeCategory]);

  const carouselArticles =
    featuredArticles.length > 0 ? featuredArticles : articles.slice(0, 5);

  const getPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink
            href={createPageURL(1)}
            onClick={(e) => handleNavigate(e, 1)}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );

      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={createPageURL(i)}
            onClick={(e) => handleNavigate(e, i)}
            isActive={i === currentPage}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      items.push(
        <PaginationItem key="last">
          <PaginationLink
            href={createPageURL(totalPages)}
            onClick={(e) => handleNavigate(e, totalPages)}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

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
            {!activeCategory &&
              currentPage === 1 &&
              carouselArticles.length > 0 && (
                <FeaturedCarousel articles={carouselArticles} />
              )}

            <div className="w-full">
              <AdBanner
                size="medium"
                placement="HOMEPAGE_BANNER"
                interval={7000}
                ads={mainBannerAds}
              />
            </div>

            <ArticleGrid
              articles={articles}
              title={
                activeCategory
                  ? `Berita Kategori: ${activeCategory}`
                  : "Berita Terbaru"
              }
            />

            {/* KONTROL PAGINATION */}
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        href={createPageURL(currentPage - 1)}
                        onClick={(e) => handleNavigate(e, currentPage - 1)}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  )}

                  {getPaginationItems()}

                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        href={createPageURL(currentPage + 1)}
                        onClick={(e) => handleNavigate(e, currentPage + 1)}
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
                <AdBanner size="small" placement="SIDEBAR_TOP" />
                <TrendingSection />
                <AdBanner size="squareMedium" placement="SIDEBAR_MIDDLE" />
                <NewsletterSection />
                <AdBanner size="small" placement="SIDEBAR_BOTTOM" />
              </div>
            </StickyBox>
          </div>
        </div>
      )}
    </div>
  );
}
