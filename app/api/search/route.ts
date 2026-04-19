import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json([]);
    }

    // Search in title, excerpt, and content
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
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
