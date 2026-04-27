import Link from "next/link";
import Image from "next/image";

import { AdBanner } from "@/components/ui/ad-banner";
import { Breadcrumb } from "@/components/article/breadcrumb";
import { TrendingSection } from "@/components/home/trending-section";
import { TrendingSearchTopics } from "@/components/home/trending-search-topics";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { Badge } from "@/components/ui/badge";
import StickyBox from "react-sticky-box";

interface SearchResult {
  id: string;
  title: string;
  excerpt: string | null;
  category: string;
  imageUrl: string | null;
  slug: string;
  publishedDate: string;
}

async function getSearchResults(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/search?q=${encodeURIComponent(query)}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch results");
  }

  return res.json();
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

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const query = (await searchParams).q || "";

  let results: SearchResult[] = [];
  let error: string | null = null;

  try {
    results = await getSearchResults(query);
  } catch (err) {
    error = err instanceof Error ? err.message : "Gagal memuat hasil pencarian";
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <AdBanner
        size="large"
        className="mb-8"
        imageUrl="https://uyqexwhmwognigyqfegc.supabase.co/storage/v1/object/public/iklan/Banner-Pemkot-scaled.jpg"
        adLink="https://makassarkota.go.id/"
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
          {`${results.length} hasil ditemukan untuk "${query}"`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 relative items-start">
        {/* Results */}
        <div className="lg:col-span-2">
          {error ? (
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
                          unoptimized
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
          )}
        </div>

        {/* Sidebar */}
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
      </div>
    </div>
  );
}
