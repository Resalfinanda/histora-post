"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface RelatedArticlesProps {
  articles: Array<{
    id: string;
    title: string;
    category: string;
    imageUrl: string | null;
    slug: string;
    publishedDate: Date;
  }>;
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="my-12 border-t border-gray-200 pt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Artikel Terkait</h2>

      <div className="space-y-4">
        {articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.slug}`}>
            <article className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
              {/* Image */}
              <div className="relative w-24 h-24 shrink-0 rounded overflow-hidden bg-gray-200">
                {article.imageUrl ? (
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-gray-300 to-gray-400" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <Badge
                  variant="secondary"
                  className="mb-2 bg-blue-400 text-white"
                >
                  {article.category}
                </Badge>
                <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(article.publishedDate).toLocaleDateString("id-ID")}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
