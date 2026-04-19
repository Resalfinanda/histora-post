"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { TrendingSection } from "@/components/home/trending-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { TrendingSearchTopics } from "@/components/home/trending-search-topics";
import { AdBanner } from "@/components/ui/ad-banner";
import { Breadcrumb } from "@/components/article";

interface SearchResult {
  id: string;
  title: string;
  excerpt: string | null;
  category: string;
  imageUrl: string | null;
  slug: string;
  publishedDate: Date;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`,
        );
        if (!response.ok) throw new Error("Failed to fetch results");
        const data = await response.json();
        setResults(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  function formatTimeAgo(date: Date): string {
    const now = new Date();
    const seconds = Math.floor(
      (now.getTime() - new Date(date).getTime()) / 1000,
    );

    if (seconds < 60) return "baru saja";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} hari lalu`;

    return new Date(date).toLocaleDateString("id-ID");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <AdBanner height="h-32 md:h-48" className="mb-8" />
      <Breadcrumb
        items={[{ label: "Beranda", href: "/" }]}
        currentPage="Pencarian"
      />
      {/* Search Info */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Hasil Pencarian
        </h1>
        <p className="text-gray-600">
          {isLoading
            ? "Mencari..."
            : `${results.length} hasil ditemukan untuk "${query}"`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Search Results Column */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-40 bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : results.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600 text-lg">
                Tidak ada artikel yang ditemukan untuk &quot;{query}&quot;
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Coba gunakan kata kunci yang berbeda
              </p>
            </div>
          ) : (
            <div className="space-y-6 ">
              {results.map((result) => (
                <Link key={result.id} href={`/articles/${result.slug}`}>
                  <article className="group rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow flex h-32 md:h-48 mb-6 ">
                    {/* Image */}
                    <div className="relative w-32 md:w-48 bg-gray-200 overflow-hidden shrink-0">
                      {result.imageUrl ? (
                        <Image
                          src={result.imageUrl}
                          alt={result.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-gray-300 to-gray-400" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-2 md:p-4 flex flex-col justify-between flex-1">
                      <Badge
                        variant="secondary"
                        className="mb-1 md:mb-2 bg-blue-100 text-blue-800 w-fit text-xs"
                      >
                        {result.category}
                      </Badge>

                      <h3 className="font-bold text-gray-800 mb-1 md:mb-2 line-clamp-2 text-xs md:text-base">
                        {result.title}
                      </h3>

                      <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2 line-clamp-2">
                        {result.excerpt}
                      </p>

                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(result.publishedDate)}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Column */}
        <aside className="space-y-6 md:space-y-8">
          <TrendingSection />
          <AdBanner height="h-64 md:h-48" />
          <TrendingSearchTopics />
          <AdBanner height="h-64 md:h-48" />
          <NewsletterSection />
        </aside>
      </div>
    </div>
  );
}
