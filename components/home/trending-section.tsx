"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";

interface TrendingItem {
  id: string;
  title: string;
  slug: string;
  createdAt?: string;
}

interface TrendingSectionProps {
  items?: TrendingItem[];
}

function formatTime(dateString?: string) {
  if (!dateString) return "";
  const diff = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) return "baru saja";
  if (hours < 24) return `${hours} jam lalu`;

  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

export function TrendingSection({ items: propItems }: TrendingSectionProps) {
  const [items, setItems] = useState<TrendingItem[]>(propItems || []);
  const [isLoading, setIsLoading] = useState(!propItems);

  useEffect(() => {
    if (propItems) return;

    const fetchTrendingArticles = async () => {
      try {
        const response = await fetch("/api/articles/trending");
        if (response.ok) {
          const data = await response.json();
          setItems(data.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch trending articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingArticles();
  }, [propItems]);

  if (isLoading) {
    return (
      <section className="mb-8 bg-linear-to-r from-blue-50 to-blue-100 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-blue-400 w-5 h-5" />
          <h3 className="text-lg font-bold text-gray-800">Trending Saat Ini</h3>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8 bg-linear-to-r from-blue-50 to-blue-100 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-blue-400 w-5 h-5" />
        <h3 className="text-lg font-bold text-gray-800">Trending Saat Ini</h3>
      </div>

      <div className="space-y-4">
        {items.length > 0 ? (
          items.slice(0, 5).map((item, index) => (
            <Link
              key={item.id}
              href={`/articles/${item.slug}`}
              className="flex items-start gap-3 group"
            >
              {/* Ranking */}
              <div className="flex flex-col items-center shrink-0">
                <span className="text-xs">🔥</span>
                <span className="text-blue-500 font-bold text-sm">
                  #{index + 1}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 group-hover:text-blue-500 transition line-clamp-2">
                  {item.title}
                </p>

                {/* Metadata */}
                <div className="text-xs text-gray-500 mt-1 flex gap-2">
                  {item.createdAt && <span>{formatTime(item.createdAt)}</span>}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-sm text-gray-500">Belum ada artikel trending</p>
        )}
      </div>
    </section>
  );
}
