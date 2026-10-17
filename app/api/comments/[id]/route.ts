import { auth } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "Anda harus login." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const result = await prisma.comment.deleteMany({
      where: {
        id,
        ...(user.role === "ADMIN" ? {} : { article: { authorId: user.id } }),
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Komentar tidak ditemukan atau tidak dapat dikelola." },
        { status: 404 },
      );
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/comments");
    revalidatePath(`/dashboard/comments/${id}`);

    return NextResponse.json({ message: "Komentar berhasil dihapus." });
  } catch (error) {
    console.error("Gagal menghapus komentar:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghapus komentar." },
      { status: 500 },
    );
  }
}
