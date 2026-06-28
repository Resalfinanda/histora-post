import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ITEMS_PER_PAGE = 7;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q")?.trim() || "";
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page")!, 10)
      : 1;
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    const startDate = startDateParam
      ? new Date(`${startDateParam}T00:00:00`)
      : null;
    const endDate = endDateParam
      ? new Date(`${endDateParam}T23:59:59.999`)
      : null;

    if (!query && !startDateParam && !endDateParam) {
      return NextResponse.json({ articles: [], total: 0, totalPages: 0 });
    }

    const skip = (page - 1) * ITEMS_PER_PAGE;

    const where: Prisma.ArticleWhereInput = {};

    if (query) {
      where.OR = [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          excerpt: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: query,
            mode: "insensitive",
          },
        },
      ];
    }

    if (startDate || endDate) {
      where.publishedDate = {} as Prisma.DateTimeFilter;

      if (startDate) {
        where.publishedDate.gte = startDate;
      }

      if (endDate) {
        where.publishedDate.lte = endDate;
      }
    }

    const total = await prisma.article.count({ where });

    const articles = await prisma.article.findMany({
      where,
      select: {
        id: true,
        title: true,
        excerpt: true,
        category: true,
        imageUrl: true,
        slug: true,
        publishedDate: true,
      },
      orderBy: {
        publishedDate: "desc",
      },
      skip,
      take: ITEMS_PER_PAGE,
    });

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    return NextResponse.json({
      articles,
      total,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { articles: [], total: 0, totalPages: 0 },
      { status: 500 },
    );
  }
}
