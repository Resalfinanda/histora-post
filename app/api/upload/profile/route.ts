import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/actions/auth";
import { STORAGE_BUCKETS } from "@/lib/storage/constants";
import { uploadImage } from "@/lib/storage/upload-image";
import { validateImageFile } from "@/lib/storage/validate-image";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user || !["ADMIN", "REDAKTUR"].includes(session.user.role)) {
    return NextResponse.json(
      { error: "Tidak terautentikasi" },
      { status: 401 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    const validationError = validateImageFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const uploaded = await uploadImage(
      file as File,
      STORAGE_BUCKETS.profile,
      `profiles/${session.user.id}`,
    );

    return NextResponse.json({ url: uploaded.url, path: uploaded.path });
  } catch (error) {
    console.error("Profile Upload Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat upload foto profil" },
      { status: 500 },
    );
  }
}
