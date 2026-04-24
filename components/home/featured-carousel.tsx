"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ArticleItem {
  id: string;
  title: string;
  excerpt: string | null;
  category: string;
  imageUrl: string | null;
  slug: string;
}

interface FeaturedCarouselProps {
  articles: ArticleItem[];
}

export function FeaturedCarousel({ articles }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay || articles.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [autoPlay, articles.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1));
    setAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
    setAutoPlay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setAutoPlay(false);
  };

  if (!articles || articles.length === 0) {
    return <div className="h-80 bg-gray-200 rounded-lg mb-8" />;
  }

  const currentArticle = articles[currentIndex];

  return (
    <div className="mb-8">
      <Link href={`/articles/${currentArticle.slug}`}>
        <div
          className="relative h-64 md:h-96 rounded-lg overflow-hidden group cursor-pointer"
          onMouseEnter={() => setAutoPlay(false)}
          onMouseLeave={() => setAutoPlay(true)}
        >
          {currentArticle.imageUrl ? (
            <Image
              src={currentArticle.imageUrl}
              alt={currentArticle.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-blue-200 to-blue-400" />
          )}

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
            <Badge className="w-fit mb-2 md:mb-3 bg-blue-400 hover:bg-blue-600 text-xs md:text-sm">
              {currentArticle.category}
            </Badge>
            <h2 className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2 line-clamp-2">
              {currentArticle.title}
            </h2>
            <p className="text-gray-200 text-xs md:text-sm line-clamp-2">
              {currentArticle.excerpt}
            </p>
          </div>

          {/* Navigation buttons - Hide on mobile */}
          {articles.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  goToPrevious();
                }}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  goToNext();
                }}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </button>
            </>
          )}
        </div>
      </Link>

      {/* Dot indicators - Show on all devices */}
      {articles.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-foreground   w-6"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
