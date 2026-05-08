import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/actions/auth";
import { supabase } from "@/lib/supabase";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const advertisement = await prisma.advertisement.findUnique({
      where: { id },
    });

    if (!advertisement) {
      return NextResponse.json(
        { error: "Advertisement not found" },
        { status: 404 },
      );
    }

    // // Track impression
    // await prisma.advertisement.update({
    //   where: { id },
    //   data: { impressions: { increment: 1 } },
    // });

    return NextResponse.json(advertisement);
  } catch (error) {
    console.error("Error fetching advertisement:", error);
    return NextResponse.json(
      { error: "Failed to fetch advertisement" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session?.user || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      title,
      description,
      imageUrl,
      adLink,
      placement,
      topics,
      isActive,
      startDate,
      endDate,
      priority,
    } = body;

    const advertisement = await prisma.advertisement.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(imageUrl && { imageUrl }),
        ...(adLink && { adLink }),
        ...(placement && { placement }),
        ...(topics && { topics }),
        ...(isActive !== undefined && { isActive }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(priority !== undefined && { priority: parseInt(priority, 10) }),
      },
    });

    return NextResponse.json(advertisement);
  } catch (error) {
    console.error("Error updating advertisement:", error);
    return NextResponse.json(
      { error: "Failed to update advertisement" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const ad = await prisma.advertisement.findUnique({
      where: { id },
    });

    if (!ad) {
      return NextResponse.json(
        { error: "Iklan tidak ditemukan" },
        { status: 404 },
      );
    }

    if (ad.imageUrl) {
      try {
        const parts = ad.imageUrl.split("/");
        const fileName = parts[parts.length - 1];

        const { error: storageError } = await supabase.storage
          .from("iklan")
          .remove([fileName]);

        if (storageError) {
          console.error("Gagal menghapus file di Storage:", storageError);
        }
      } catch (err) {
        console.error("Error parsing URL atau akses Storage:", err);
      }
    }

    await prisma.advertisement.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Iklan dan gambar berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    return NextResponse.json(
      { error: "Gagal menghapus iklan" },
      { status: 500 },
    );
  }
}
