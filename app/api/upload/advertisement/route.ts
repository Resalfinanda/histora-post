import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/actions/auth";
import { STORAGE_BUCKETS } from "@/lib/storage/constants";
import { uploadImage } from "@/lib/storage/upload-image";
import { validateImageFile } from "@/lib/storage/validate-image";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const file = (await request.formData()).get("file");
    const validationError = validateImageFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const uploaded = await uploadImage(
      file as File,
      STORAGE_BUCKETS.advertisement,
    );

    return NextResponse.json({
      success: true,
      url: uploaded.url,
      path: uploaded.path,
      message: "Gambar berhasil diupload",
    });
  } catch (error) {
    console.error("Advertisement Upload Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat upload gambar iklan" },
      { status: 500 },
    );
  }
}