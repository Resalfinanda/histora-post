import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const comment = await prisma.comment.create({
    data: {
      articleId: body.articleId,
      name: body.name,
      email: body.email,
      content: body.content,
    },
  });

  return NextResponse.json(comment);
}
