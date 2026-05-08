"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AdBanner } from "@/components/ui/ad-banner";
import { Breadcrumb } from "@/components/article/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { SearchSidebar } from "./sidebar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface SearchResult {
  id: string;
  title: string;
  excerpt: string | null;
  category: string;
  imageUrl: string | null;
  slug: string;
  publishedDate: string;
}

interface SearchResponse {
  articles: SearchResult[];
  total: number;
  totalPages: number;
  currentPage: number;
}

function formatTimeAgo(date: string): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (seconds < 60) return "baru saja";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} hari lalu`;

  return new Date(date).toLocaleDateString("id-ID");
}

function PaginationControls({
  currentPage,
  totalPages,
  query,
}: {
  currentPage: number;
  totalPages: number;
  query: string;
}) {
  const getPageUrl = (page: number) => {
    return `/search?q=${encodeURIComponent(query)}&page=${page}`;
  };

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
          <PaginationLink href={getPageUrl(1)}>1</PaginationLink>
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
          <PaginationLink href={getPageUrl(i)} isActive={i === currentPage}>
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
          <PaginationLink href={getPageUrl(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={getPageUrl(currentPage - 1)} />
          </PaginationItem>
        )}

        {getPaginationItems()}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={getPageUrl(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

export function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [data, setData] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);

      if (!query.trim()) {
        setData({ articles: [], total: 0, totalPages: 0, currentPage: 1 });
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&page=${page}`,
          {
            cache: "no-store",
          },
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch results: ${res.status}`);
        }

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Search fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Gagal memuat hasil pencarian",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, page]);

  const results = data?.articles || [];
  const totalPages = data?.totalPages || 0;
  const currentPage = data?.currentPage || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <AdBanner
        height="h-22 md:h-64"
        className="mb-8"
        placement="SEARCH_RESULTS"
      />

      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }]}
        currentPage="Pencarian"
      />

      {/* Search Info */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Hasil Pencarian
        </h1>
        <p className="text-foreground/60">
          {`${data?.total || 0} hasil ditemukan untuk "${query}"`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 relative items-start">
        {/* Results */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-foreground/60 text-lg">
                Memuat hasil pencarian...
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : results.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-foreground/60 text-lg">
                Tidak ada artikel yang ditemukan untuk &quot;{query}&quot;
              </p>
              <p className="text-foreground/50 text-sm mt-2">
                Coba gunakan kata kunci yang berbeda
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {results.map((result) => (
                  <Link key={result.id} href={`/articles/${result.slug}`}>
                    <article className="group rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex h-24 md:h-32 mb-6">
                      {/* Image */}
                      <div className="relative w-24 md:w-32 bg-gray-200 overflow-hidden shrink-0">
                        {result.imageUrl ? (
                          <Image
                            src={result.imageUrl}
                            alt={result.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-gray-300 to-gray-400" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="pl-2 md:pl-4 flex flex-col justify-between flex-1">
                        <Badge
                          variant="secondary"
                          className="bg-blue-500 text-white w-fit text-[10px]"
                        >
                          {result.category}
                        </Badge>

                        <h3 className="font-bold text-foreground/80 line-clamp-2 text-[10px] md:text-base">
                          {result.title}
                        </h3>

                        <p className="text-[10px] md:text-sm text-foreground/60 mb-1 md:mb-2 line-clamp-2">
                          {result.excerpt}
                        </p>

                        <p className="text-[10px] text-foreground/50">
                          {formatTimeAgo(result.publishedDate)}
                        </p>
                      </div>
                    </article>
                    <hr className="h-px my-3 bg-neutral-quaternary border" />
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                query={query}
              />
            </>
          )}
        </div>

        {/* Sidebar */}
        <SearchSidebar />
      </div>
    </div>
  );
}
