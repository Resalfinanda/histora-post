import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { auth } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ManageCommentsPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) return null;

  const isAdmin = user.role === "ADMIN";
  const comments = await prisma.comment.findMany({
    where: isAdmin ? {} : { article: { authorId: user.id } },
    include: {
      article: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0f172a]">Kelola Komentar</h2>
        <p className="mt-1 text-sm text-slate-500">
          {isAdmin
            ? "Tinjau dan kelola komentar pada semua artikel."
            : "Tinjau dan kelola komentar pada artikel yang Anda tulis."}
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="pl-4">Isi Komentar</TableHead>
              <TableHead>Email Pengirim</TableHead>
              <TableHead>Artikel</TableHead>
              <TableHead>Tanggal & Waktu</TableHead>
              <TableHead className="pr-4 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-28 text-center text-slate-500"
                >
                  Belum ada komentar yang dapat dikelola.
                </TableCell>
              </TableRow>
            ) : (
              comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="max-w-sm whitespace-normal pl-4">
                    <p className="line-clamp-2 text-slate-800">
                      {comment.content}
                    </p>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {comment.email}
                  </TableCell>
                  <TableCell className="max-w-xs whitespace-normal text-slate-600">
                    {comment.article.title}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-slate-600">
                    {comment.createdAt.toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/comments/${comment.id}`}>
                        Lihat Detail
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
