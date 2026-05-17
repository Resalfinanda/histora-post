"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { imageSizes, getBlurDataUrl } from "@/lib/imageOptimization";

interface FeaturedArticleProps {
  title: string;
  excerpt: string;
  category: string;
  imageUrl: string | null;
  slug: string;
}

export function FeaturedArticle({
  title,
  excerpt,
  category,
  imageUrl,
  slug,
}: FeaturedArticleProps) {
  return (
    <Link href={`/articles/${slug}`}>
      <div className="relative h-80 rounded-lg overflow-hidden group cursor-pointer mb-8">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes={imageSizes.featuredArticle}
            priority
            placeholder="blur"
            blurDataURL={getBlurDataUrl()}
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-blue-200 to-blue-400" />
        )}

        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <Badge className="w-fit mb-3 bg-[#0f172a] hover:bg-blue-400">
            {category}
          </Badge>
          <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
          <p className="text-foreground/50 text-sm line-clamp-2">{excerpt}</p>
        </div>
      </div>
    </Link>
  );
}
