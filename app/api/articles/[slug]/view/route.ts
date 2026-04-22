import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug tidak ditemukan" },
        { status: 400 },
      );
    }

    // Menggunakan fitur increment dari Prisma
    const updatedArticle = await prisma.article.update({
      where: { slug: slug },
      data: {
        views: {
          increment: 1,
        },
      },
      select: {
        views: true,
      },
    });

    return NextResponse.json({
      success: true,
      views: updatedArticle.views,
    });
  } catch (error) {
    console.error("Gagal update views:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate jumlah tayangan" },
      { status: 500 },
    );
  }
}
