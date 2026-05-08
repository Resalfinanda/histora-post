import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/app/actions/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - hanya admin yang bisa upload gambar" },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 },
      );
    }

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Tipe file tidak valid. Hanya JPEG, PNG, GIF, dan WebP yang diizinkan.",
        },
        { status: 400 },
      );
    }

    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file terlalu besar. Maksimal 1 MB." },
        { status: 400 },
      );
    }

    const cleanFileName = file.name
      .replace(/[^a-zA-Z0-9.\-]/g, "")
      .toLowerCase();
    const uniqueFilename = `${Date.now()}-${cleanFileName}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { data, error } = await supabase.storage
      .from("iklan")
      .upload(uniqueFilename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase Upload Error:", error);
      return NextResponse.json(
        { error: `Upload gagal: ${error.message}` },
        { status: 500 },
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("iklan")
      .getPublicUrl(uniqueFilename);

    return NextResponse.json(
      {
        success: true,
        url: publicUrlData.publicUrl,
        message: "Gambar berhasil diupload",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat upload gambar" },
      { status: 500 },
    );
  }
}
