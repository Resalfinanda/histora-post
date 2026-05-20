"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";

interface StoryArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt?: string | null;
  imageUrl: string | null;
  publishedDate?: string | Date;
}

// function formatTimeAgo(dateLike?: string | Date) {
//   if (!dateLike) return "";
//   const d = typeof dateLike === "string" ? new Date(dateLike) : dateLike;
//   if (isNaN(d.getTime())) return "";

//   const diffSeconds = Math.floor((Date.now() - d.getTime()) / 1000);
//   if (diffSeconds < 60) return "baru saja";
//   if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} menit lalu`;
//   if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} jam lalu`;
//   if (diffSeconds < 604800)
//     return `${Math.floor(diffSeconds / 86400)} hari lalu`;

//   return d.toLocaleDateString("id-ID");
// }

export function StorySection() {
  const [items, setItems] = useState<StoryArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInspiratif = async () => {
      try {
        const res = await fetch("/api/articles?limit=7&category=Inspiratif");

        if (!res.ok) return;

        const data = await res.json();

        const list: StoryArticle[] = Array.isArray(data)
          ? data
          : data?.articles || [];

        setItems(list.slice(0, 7));
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };

    fetchInspiratif();
  }, []);

  return (
    <section className="mb-8 rounded-lg p-6 bg-linear-to-r from-blue-50 to-blue-100">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-blue-500 w-5 h-5" />
        <h3 className="text-lg font-bold text-gray-800"> Kisah Inspiratif</h3>
      </div>

      {isLoading ? (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-56 md:w-60 h-44 rounded-lg bg-gray-200 animate-pulse shrink-0"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500">Belum ada artikel inspiratif</p>
      ) : (
        <div className="relative">
          <div
            className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {items.map((article) => {
              // const timeAgo = formatTimeAgo(article.publishedDate);
              return (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="shrink-0 w-42 md:w-48"
                >
                  <article
                    className="group rounded-lg overflow-hidden bg-white border border-gray-200 hover:border-blue-300 transition-colors"
                    style={{ contain: "layout style" }}
                  >
                    <div className="h-28 md:h-42 bg-gray-100 relative">
                      {article.imageUrl ? (
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="240px"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-gray-300 to-gray-400" />
                      )}
                    </div>

                    <div className="p-3">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] md:text-[11px] font-semibold text-blue-600">
                          {article.excerpt}
                        </span>
                        {/* {timeAgo ? (
                          <span className="text-[10px] text-gray-500 shrink-0">
                            {timeAgo}
                          </span>
                        ) : null} */}
                      </div>

                      <h4 className="text-[10px] md:text-[12px] font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h4>
                    </div>
                  </article>
                </Link>
              );
            })}

            <Link
              href="/?category=Inspiratif"
              className="shrink-0 w-56 md:w-60"
            >
              <div
                className="h-46 md:h-62 rounded-lg bg-gray-300 text-black hover:bg-blue-700 hover:text-white transition-colors flex items-center justify-center p-4"
                style={{ contain: "layout style" }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="text-xl leading-none">➜</div>
                  <div className="text-sm font-bold">Lihat lainnya</div>
                  <div className="text-xs opacity-90">Kategori inspiratif</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
