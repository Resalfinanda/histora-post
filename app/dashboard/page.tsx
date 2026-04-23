import { auth } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp, Users, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  // 1. Ambil session user yang sedang login
  const session = await auth();
  const user = session?.user;

  if (!user) return null; // Fallback aman jika belum login

  const isAdmin = user.role === "ADMIN";

  // 2. Buat kondisi query: Admin ambil semua, Redaktur ambil miliknya sendiri
  const articleCondition = isAdmin ? {} : { authorId: user.id };

  // 3. FETCH DATA PRISMA SECARA PARALEL (Agar loading lebih cepat)
  const [
    totalArticles,
    viewsAggregation,
    categoryGrouping,
    activeWritersCount,
    recentArticles,
  ] = await Promise.all([
    // A. Menghitung total artikel
    prisma.article.count({ where: articleCondition }),

    // B. Menghitung total akumulasi views dari semua artikel
    prisma.article.aggregate({
      _sum: { views: true },
      where: articleCondition,
    }),

    // C. Mencari Kategori Terpopuler (berdasarkan jumlah artikel terbanyak)
    prisma.article.groupBy({
      by: ["category"],
      _count: { category: true },
      where: articleCondition,
      orderBy: { _count: { category: "desc" } },
      take: 1, // Ambil 1 peringkat teratas
    }),

    // D. Menghitung jumlah Redaktur (Hanya relevan untuk Admin)
    isAdmin
      ? prisma.user.count({ where: { role: "REDAKTUR" } })
      : Promise.resolve(0),

    // E. Mengambil 5 artikel terbaru untuk tabel list
    prisma.article.findMany({
      where: articleCondition,
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        author: { select: { name: true } },
      },
    }),
  ]);

  // Ekstrak hasil query
  const totalViews = viewsAggregation._sum.views || 0;
  const topCategory =
    categoryGrouping.length > 0
      ? categoryGrouping[0].category
      : "Belum ada data";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[#0f172a]">
          Halo, {user.name}!
        </h2>
        <p className="text-slate-500 mt-1">
          {isAdmin
            ? "Pantau statistik dan performa keseluruhan portal berita Histora Post."
            : "Pantau performa artikel-artikel yang telah Anda publikasikan."}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Artikel Publish
            </CardTitle>
            <FileText className="h-4 w-4 text-[#0f172a]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {totalArticles}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Pembaca (Views)
            </CardTitle>
            <Eye className="h-4 w-4 text-[#0f172a]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {totalViews.toLocaleString("id-ID")}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Kategori Terpopuler
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-[#0f172a]" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-900 line-clamp-1">
              {topCategory}
            </div>
          </CardContent>
        </Card>

        {/* Tampilkan card penulis aktif HANYA JIKA yang login adalah ADMIN */}
        {isAdmin && (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Total Redaktur
              </CardTitle>
              <Users className="h-4 w-4 text-[#0f172a]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {activeWritersCount}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabel 5 Artikel Terbaru */}
      <div className="mt-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[#0f172a]">5 Artikel Terbaru</CardTitle>
            <Link href="/dashboard/articles">
              <Button variant="outline" size="sm">
                Lihat Semua
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">
                    Judul Artikel
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">
                    Kategori
                  </TableHead>
                  {isAdmin && (
                    <TableHead className="font-semibold text-slate-700">
                      Penulis
                    </TableHead>
                  )}
                  <TableHead className="text-right font-semibold text-slate-700">
                    Tanggal
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentArticles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={isAdmin ? 4 : 3}
                      className="text-center h-24 text-slate-500"
                    >
                      Belum ada artikel yang dipublish.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentArticles.map((article) => (
                    <TableRow key={article.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-medium text-[#0f172a]">
                        <span className="line-clamp-1">{article.title}</span>
                      </TableCell>
                      <TableCell>
                        <Badge>{article.category}</Badge>
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-slate-600">
                          {article.author?.name || "Tidak diketahui"}
                        </TableCell>
                      )}
                      <TableCell className="text-right text-slate-600 text-sm">
                        {article.createdAt.toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
