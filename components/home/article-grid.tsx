"use client";

import { ArticleCard } from "./article-card";

interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  category: string;
  imageUrl: string | null;
  slug: string;
  publishedDate: Date;
}

interface ArticleGridProps {
  articles: Article[];
  title: string;
}

export function ArticleGrid({ articles, title }: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
        <p className="text-gray-600 text-center py-8">
          Tidak ada artikel tersedia
        </p>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
      <div className="grid grid-cols-1 gap-4">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            title={article.title}
            excerpt={article.excerpt || ""}
            category={article.category}
            imageUrl={article.imageUrl}
            slug={article.slug}
            publishedDate={article.publishedDate || new Date()}
          />
        ))}
      </div>
    </section>
  );
}
