import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ITEMS_PER_PAGE = 7;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1;

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ articles: [], total: 0, totalPages: 0 });
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * ITEMS_PER_PAGE;

    // Get total count for pagination
    const total = await prisma.article.count({
      where: {
        OR: [
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
        ],
      },
    });

    // Search in title, excerpt, and content with pagination
    const articles = await prisma.article.findMany({
      where: {
        OR: [
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
        ],
      },
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
      { status: 500 }
    );
  }
}