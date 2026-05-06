import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { Filter } from "bad-words";
import { BadWords } from "@/lib/badwords";
import { normalizeText } from "@/lib/textNormalizer";

const filter = new Filter();
filter.addWords(...BadWords);

const commentSchema = z.object({
  articleId: z.string().min(1, "ID Artikel tidak valid"),
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(30, "Nama maksimal 30 karakter"),
  email: z.string().email("Format email tidak valid"),
  content: z
    .string()
    .min(3, "Komentar minimal 3 karakter")
    .max(500, "Komentar terlalu panjang (maks 500 karakter)"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = commentSchema.parse(body);

    const contentToCheck = normalizeText(validatedData.content);
    const nameToCheck = normalizeText(validatedData.name);

    if (filter.isProfane(contentToCheck) || filter.isProfane(nameToCheck)) {
      return NextResponse.json(
        { error: "Komentar Anda mengandung kata-kata yang tidak pantas." },
        { status: 400 },
      );
    }

    const comment = await prisma.comment.create({
      data: {
        articleId: validatedData.articleId,
        name: validatedData.name,
        email: validatedData.email,
        content: validatedData.content,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 },
      );
    }

    console.error("Komentar Error:", error);
    return NextResponse.json(
      { error: "Gagal memproses komentar. Silakan coba lagi nanti." },
      { status: 500 },
    );
  }
}
