"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

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
      <article className="group rounded-lg overflow-hidden transition-shadow flex h-24 md:h-32">
        {/* Image */}
        <div className="relative w-24 md:w-32  overflow-hidden shrink-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-gray-300 to-gray-400" />
          )}
        </div>

        {/* Content */}
        <div className="pl-2 md:pl-4 flex flex-col justify-between flex-1">
          <Badge
            variant="secondary"
            className=" bg-blue-400 text-white w-fit text-[10px] md:text-xs"
          >
            {category}
          </Badge>

          <h4 className="font-bold text-foreground line-clamp-2 text-[10px] md:text-base">
            {title}
          </h4>

          <p className="text-[10px] md:text-sm text-foreground/50 mb-1 md:mb-3 line-clamp-2">
            {excerpt}
          </p>

          <p className="text-xs text-foreground/50 hidden md:block">
            {timeAgo}
          </p>
        </div>
      </article>
      <hr className="h-px my-4 bg-neutral-quaternary border"></hr>
    </Link>
  );
}
