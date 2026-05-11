import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const categoryParam = searchParams.get("category");

    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limit = limitParam ? parseInt(limitParam, 10) : 5;
    const skip = (page - 1) * limit;

    const whereCondition: Prisma.ArticleWhereInput = {};
    if (categoryParam) {
      whereCondition.category = categoryParam;
    }

    const [articles, totalCount, featuredArticles] = await Promise.all([
      prisma.article.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        include: { comments: true },
        orderBy: { createdAt: "desc" },
      }),

      prisma.article.count({
        where: whereCondition,
      }),

      page === 1 && !categoryParam
        ? prisma.article.findMany({
            where: { isHeadline: true },
            take: 5,
            orderBy: { createdAt: "desc" },
          })
        : Promise.resolve([]),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      articles,
      totalPages,
      featuredArticles,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data artikel" },
      { status: 500 },
    );
  }
}
