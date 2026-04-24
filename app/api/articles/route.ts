import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function GET() {
  const articles = await prisma.article.findMany({
    take: 50, 
    include: { comments: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(articles);
}
