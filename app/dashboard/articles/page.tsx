// app/dashboard/articles/page.tsx

import { prisma } from "@/lib/prisma";
import ArticlesClient from "./articlesClient";

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; category?: string }>;
}) {
  const params = await searchParams;

  const query = params?.query || "";
  const category = params?.category || "all";

  const articles = await prisma.article.findMany({
    where: {
      AND: [
        query
          ? {
              title: {
                contains: query,
                mode: "insensitive",
              },
            }
          : {},
        category !== "all"
          ? {
              category: {
                equals: category,
                mode: "insensitive",
              },
            }
          : {},
      ],
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const categories = await prisma.article.findMany({
    select: { category: true },
    distinct: ["category"],
  });

  return (
    <ArticlesClient
      articles={articles}
      query={query}
      category={category}
      categories={categories}
    />
  );
}
