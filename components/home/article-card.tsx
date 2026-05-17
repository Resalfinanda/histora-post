"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { imageSizes, getBlurDataUrl } from "@/lib/imageOptimization";

interface ArticleCardProps {
  title: string;
  excerpt: string;
  category: string;
  imageUrl: string | null;
  slug: string;
  publishedDate: Date;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "baru saja";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} hari lalu`;

  return date.toLocaleDateString("id-ID");
}

export function ArticleCard({
  title,
  excerpt,
  category,
  imageUrl,
  slug,
  publishedDate,
}: ArticleCardProps) {
  const timeAgo = formatTimeAgo(new Date(publishedDate));

  return (
    <Link href={`/articles/${slug}`}>
      <article
        className="group rounded-lg overflow-hidden transition-shadow flex h-24 md:h-32"
        style={{ contain: "layout style paint" }}
      >
        <div className="relative w-24 md:w-32 aspect-square overflow-hidden shrink-0 bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes={imageSizes.articleCard}
              loading="lazy"
              placeholder="blur"
              blurDataURL={getBlurDataUrl()}
              className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-gray-300 to-gray-400" />
          )}
        </div>

        <div className="pl-2 md:pl-4 flex flex-col justify-between flex-1">
          <Badge className=" bg-[#0f172a] hover:bg-blue-400 text-white w-fit text-[10px] md:text-xs">
            {category}
          </Badge>

          <h2 className="font-bold text-foreground line-clamp-2 mb-0.5 text-[10px] md:text-base">
            {title}
          </h2>

          <p className="text-[10px] md:text-sm text-foreground/80 mb-0.5 md:mb-1 line-clamp-2">
            {excerpt}
          </p>

          <p className="text-[10px] text-foreground/80 hidden md:block">
            {timeAgo}
          </p>
        </div>
      </article>
      <hr className="h-px my-4 bg-neutral-quaternary border"></hr>
    </Link>
  );
}
