"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";

interface TrendingItem {
  id: string;
  title: string;
  slug: string;
}

interface TrendingSectionProps {
  items?: TrendingItem[];
}

export function TrendingSection({ items: propItems }: TrendingSectionProps) {
  const [items, setItems] = useState<TrendingItem[]>(propItems || []);
  const [isLoading, setIsLoading] = useState(!propItems);

  useEffect(() => {
    // Jika props sudah diberikan, jangan fetch
    if (propItems) return;

    const fetchTrendingArticles = async () => {
      try {
        const response = await fetch("/api/articles");
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
          <h3 className="text-lg font-bold text-gray-800">TRENDING SAAT INI</h3>
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
        <h3 className="text-lg font-bold text-gray-800">TRENDING SAAT INI</h3>
      </div>

      <div className="space-y-3">
        {items.length > 0 ? (
          items.slice(0, 5).map((item, index) => (
            <Link
              key={item.id}
              href={`/articles/${item.slug}`}
              className="flex items-start gap-3 group"
            >
              <div className="text-blue-400 font-bold text-sm pt-1 shrink-0">
                {String(index + 1).padStart(2, "0")}
              </div>
              <p className="text-sm text-gray-700 group-hover:text-blue-400 transition-colors line-clamp-2">
                {item.title}
              </p>
            </Link>
          ))
        ) : (
          <p className="text-sm text-gray-500">Belum ada artikel trending</p>
        )}
      </div>
    </section>
  );
}
