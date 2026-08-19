import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/actions/auth";
import { STORAGE_BUCKETS } from "@/lib/storage/constants";
import { deleteImage, getStoragePath } from "@/lib/storage/delete-image";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

function normalizeDateInput(
  value: string | Date | null | undefined,
  mode: "start" | "end",
) {
  if (value === null || value === undefined) return null;

  if (value instanceof Date) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
  if (dateOnlyPattern.test(trimmed)) {
    const [year, month, day] = trimmed.split("-").map(Number);

    if (mode === "start") {
      return new Date(year, month - 1, day, 0, 0, 0, 0);
    }

    return new Date(year, month - 1, day, 23, 59, 59, 999);
  }

  const parsedDate = new Date(trimmed);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
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
    const previousAdvertisement = await prisma.advertisement.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

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
        ...(startDate !== undefined && {
          startDate: normalizeDateInput(startDate, "start"),
        }),
        ...(endDate !== undefined && {
          endDate: normalizeDateInput(endDate, "end"),
        }),
        ...(priority !== undefined && { priority: parseInt(priority, 10) }),
      },
    });

    if (
      imageUrl &&
      previousAdvertisement?.imageUrl &&
      imageUrl !== previousAdvertisement.imageUrl
    ) {
      const oldImagePath = getStoragePath(
        previousAdvertisement.imageUrl,
        STORAGE_BUCKETS.advertisement,
      );
      if (oldImagePath) {
        await deleteImage(STORAGE_BUCKETS.advertisement, oldImagePath).catch(
          (storageError) =>
            console.error("Gagal menghapus gambar iklan lama:", storageError),
        );
      }
    }

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
      const imagePath = getStoragePath(
        ad.imageUrl,
        STORAGE_BUCKETS.advertisement,
      );
      if (imagePath) {
        await deleteImage(STORAGE_BUCKETS.advertisement, imagePath).catch(
          (storageError) =>
            console.error("Gagal menghapus file di Storage:", storageError),
        );
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
