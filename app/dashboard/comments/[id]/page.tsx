import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  Mail,
  Newspaper,
  UserRound,
} from "lucide-react";
import { auth } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteCommentButton } from "./delete-comment-button";

export default async function CommentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  const user = session?.user;

  if (!user) return null;

  const comment = await prisma.comment.findFirst({
    where: {
      id,
      ...(user.role === "ADMIN" ? {} : { article: { authorId: user.id } }),
    },
    include: {
      article: { select: { title: true } },
    },
  });

  if (!comment) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#0f172a]">
            Detail Komentar
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Informasi lengkap komentar yang dikirimkan pembaca.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/comments">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Kembali ke Komentar
          </Link>
        </Button>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Isi Komentar</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap break-words leading-relaxed text-slate-700">
            {comment.content}
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Informasi Pengiriman</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Nama Pengirim
              </p>
              <p className="text-slate-800">{comment.name}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Email
              </p>
              <a
                href={`mailto:${comment.email}`}
                className="break-all text-blue-700 hover:underline"
              >
                {comment.email}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Newspaper className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Artikel
              </p>
              <p className="text-slate-800">{comment.article.title}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Tanggal & Waktu Dikirim
              </p>
              <p className="text-slate-800">
                {comment.createdAt.toLocaleString("id-ID", {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <DeleteCommentButton commentId={comment.id} />
      </div>
    </div>
  );
}
