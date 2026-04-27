import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const articles = await prisma.article.findMany({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });

  const trending = articles
    .map((article) => {
      const views = article.views || 0;
      const comments = article._count?.comments || 0;

      const score = views + comments * 2;

      return { ...article, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return NextResponse.json(trending);
}
