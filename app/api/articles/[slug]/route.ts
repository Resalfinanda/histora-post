import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const article = await prisma.article.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      comments: true,
    },
  });

  return NextResponse.json(article);
}