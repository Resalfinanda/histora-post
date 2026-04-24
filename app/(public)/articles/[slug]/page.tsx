"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Breadcrumb,
  ArticleHeader,
  ShareButtons,
  RelatedArticles,
  CommentForm,
  CommentsList,
} from "@/components/article";
import { TrendingSection } from "@/components/home/trending-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { AdBanner } from "@/components/ui/ad-banner";
import ArticleTracker from "@/components/article/articleViewTracker";

interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string;
  imageUrl: string | null;
  author: {
    id: string;
    name: string;
    email: string;
  };
  publishedDate: Date;
  slug: string;
  comments: Array<{
    id: string;
    name: string;
    content: string;
    createdAt: Date;
  }>;
}

export default function ArticlePage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${slug}`);
        if (!response.ok) throw new Error("Article not found");
        const data = await response.json();
        setArticle(data);

        // Fetch related articles (same category, exclude current)
        const allArticlesResponse = await fetch("/api/articles");
        const allArticles = await allArticlesResponse.json();
        const related = allArticles
          .filter(
            (a: Article) => a.category === data.category && a.id !== data.id,
          )
          .slice(0, 5);
        setRelatedArticles(related);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch article",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const handleCommentAdded = async () => {
    // Refresh comments
    try {
      const response = await fetch(`/api/articles/${slug}`);
      const updatedArticle = await response.json();
      setArticle(updatedArticle);
    } catch (error) {
      console.error("Failed to refresh comments:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-96 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || "Article not found"}
        </div>
      </div>
    );
  }

  const articleUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/articles/${slug}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-6 md:mb-8">
        <AdBanner
          height="h-22 md:h-64"
          imageUrl="https://uyqexwhmwognigyqfegc.supabase.co/storage/v1/object/public/iklan/Banner-Pemkot-scaled.jpg"
          adLink="https://makassarkota.go.id/"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Article Column */}
        <article className="lg:col-span-2">
          <ArticleTracker slug={article.slug} />
          {/* Breadcrumb */}
          <Breadcrumb
            items={[{ label: "Beranda", href: "/" }]}
            currentPage={article.title}
          />

          {/* Article Header */}
          <ArticleHeader
            title={article.title}
            category={article.category}
            author={article.author.name}
            publishedDate={article.publishedDate}
          />

          {/* Featured Image */}
          {article.imageUrl && (
            <div className="relative w-full h-48 md:h-96 rounded-lg overflow-hidden mb-6 md:mb-8 bg-gray-200">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          )}

          {/* Share Buttons */}
          <ShareButtons title={article.title} url={articleUrl} />

          {/* Article Content */}
          <div
            className="prose prose-sm md:prose-lg max-w-none mb-8 md:mb-12 text-foreground prose-headings:text-[#0f172a] prose-a:text-blue-600 hover:prose-a:text-[#0f172a] article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="border-t border-b border-gray-200 py-4 md:py-6 my-6 md:my-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs md:text-sm text-foreground/50">
                  Ditulis oleh
                </p>
                <p className="font-bold text-sm md:text-base text-foreground">
                  {article.author.name}
                </p>
              </div>
              <div className="md:text-right">
                <p className="text-xs md:text-sm text-foreground/50">
                  Dipublikasikan pada
                </p>
                <p className="font-bold text-sm md:text-base text-foreground">
                  {new Date(article.publishedDate).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="my-6 md:my-8">
            <AdBanner
              size="medium"
              imageUrl="https://uyqexwhmwognigyqfegc.supabase.co/storage/v1/object/public/iklan/Dispora.jpeg"
              adLink="https://dispora.makassarkota.go.id/"
            />
          </div>

          {/* Related Articles */}
          <RelatedArticles articles={relatedArticles} />

          {/* Comments Section */}
          <div className="my-8 md:my-12">
            <CommentsList
              comments={article.comments}
              count={article.comments.length}
            />

            <CommentForm
              articleId={article.id}
              onCommentAdded={handleCommentAdded}
            />
          </div>
        </article>

        {/* Sidebar Column */}
        <aside className="space-y-6 md:space-y-8">
          <TrendingSection />

          <AdBanner size="medium" />

          <NewsletterSection />
        </aside>
      </div>
    </div>
  );
}
