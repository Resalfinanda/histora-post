import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

type ArticleWithComments = Prisma.ArticleGetPayload<{
  include: {
    comments: true;
  };
}>;

function calculateScore(article: ArticleWithComments) {
  const views = article.views || 0;
  const comments = article.comments.length || 0;

  const hoursAgo =
    (Date.now() - new Date(article.createdAt).getTime()) /
    (1000 * 60 * 60);

  const recencyBoost = Math.max(0, 24 - hoursAgo);

  return views * 0.6 + comments * 0.3 + recencyBoost;
}

export async function GET() {
  const articles = await prisma.article.findMany({
    take: 50, 
    orderBy: { createdAt: "desc" },
    include: {
      comments: true,
    },
  });

  const trending = articles
    .map((article) => ({
      ...article,
      score: calculateScore(article),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return NextResponse.json(trending);
}