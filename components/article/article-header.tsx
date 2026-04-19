"use client";

import { Badge } from "@/components/ui/badge";

interface ArticleHeaderProps {
  title: string;
  category: string;
  author: string;
  publishedDate: Date;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ArticleHeader({
  title,
  category,
  author,
  publishedDate,
}: ArticleHeaderProps) {
  return (
    <div className="mb-6">
      <Badge className="mb-3 bg-blue-400 hover:bg-blue-900">{category}</Badge>

      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        {title}
      </h1>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <span>{author}</span>
        <span>•</span>
        <time>{formatDate(publishedDate)}</time>
        <span>•</span>
        <span>3 menit baca</span>
      </div>
    </div>
  );
}
