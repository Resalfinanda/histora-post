"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";

interface TrendingSearchTopic {
  id: string;
  term: string;
  count: number;
}

interface TrendingSearchProps {
  topics?: TrendingSearchTopic[];
}

export function TrendingSearchTopics({ topics }: TrendingSearchProps) {
  // Mock trending search topics
  const defaultTopics: TrendingSearchTopic[] = [
    { id: "1", term: "Sosial", count: 123 },
    { id: "2", term: "Politik", count: 90 },
    { id: "3", term: "Olahraga", count: 50 },
    { id: "4", term: "Hiburan", count: 20 },
    { id: "5", term: "Kesehatan", count: 14 },
  ];

  const displayTopics = topics || defaultTopics;

  return (
    <section className="bg-linear-to-r from-blue-50 to-blue-100 rounded-lg p-6 my-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-blue-500 w-5 h-5" />
        <h3 className="text-lg font-bold text-gray-800">Trending Pencarian</h3>
      </div>

      <div className="space-y-3">
        {displayTopics.map((topic, index) => (
          <Link
            key={topic.id}
            href={`/search?q=${encodeURIComponent(topic.term)}`}
            className="flex items-center gap-3 group"
          >
            <div className="text-blue-500 font-bold text-sm pt-1 shrink-0">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 group-hover:text-blue-500 transition-colors">
                {topic.term}
              </p>
              <p className="text-xs text-gray-500">{topic.count} pencarian</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
