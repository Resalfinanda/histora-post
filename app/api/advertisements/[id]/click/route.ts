import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const advertisement = await prisma.advertisement.update({
      where: { id },
      data: { clicks: { increment: 1 } },
    });

    return NextResponse.json({ success: true, clicks: advertisement.clicks });
  } catch (error) {
    console.error("Error tracking ad click:", error);
    return NextResponse.json(
      { error: "Failed to track click" },
      { status: 500 },
    );
  }
}
