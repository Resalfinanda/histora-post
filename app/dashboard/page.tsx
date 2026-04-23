// import { auth } from "@/app/actions/auth";
// import { prisma } from "@/lib/prisma";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { FileText, TrendingUp, Users, Eye } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";

// export default async function DashboardPage() {
//   // 1. Ambil session user yang sedang login
//   const session = await auth();
//   const user = session?.user;

//   if (!user) return null; // Fallback aman jika belum login

//   const isAdmin = user.role === "ADMIN";

//   // 2. Buat kondisi query: Admin ambil semua, Redaktur ambil miliknya sendiri
//   const articleCondition = isAdmin ? {} : { authorId: user.id };

//   // 3. FETCH DATA PRISMA SECARA PARALEL (Agar loading lebih cepat)
//   const [
//     totalArticles,
//     viewsAggregation,
//     categoryGrouping,
//     activeWritersCount,
//     recentArticles,
//   ] = await Promise.all([
//     // A. Menghitung total artikel
//     prisma.article.count({ where: articleCondition }),

//     // B. Menghitung total akumulasi views dari semua artikel
//     prisma.article.aggregate({
//       _sum: { views: true },
//       where: articleCondition,
//     }),

//     // C. Mencari Kategori Terpopuler (berdasarkan jumlah artikel terbanyak)
//     prisma.article.groupBy({
//       by: ["category"],
//       _count: { category: true },
//       where: articleCondition,
//       orderBy: { _count: { category: "desc" } },
//       take: 1, // Ambil 1 peringkat teratas
//     }),

//     // D. Menghitung jumlah Redaktur (Hanya relevan untuk Admin)
//     isAdmin
//       ? prisma.user.count({ where: { role: "REDAKTUR" } })
//       : Promise.resolve(0),

//     // E. Mengambil 5 artikel terbaru untuk tabel list
//     prisma.article.findMany({
//       where: articleCondition,
//       orderBy: { createdAt: "desc" },
//       take: 5,
//       include: {
//         author: { select: { name: true } },
//       },
//     }),
//   ]);

//   // Ekstrak hasil query
//   const totalViews = viewsAggregation._sum.views || 0;
//   const topCategory =
//     categoryGrouping.length > 0
//       ? categoryGrouping[0].category
//       : "Belum ada data";

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-3xl font-bold text-[#0f172a]">
//           Halo, {user.name}!
//         </h2>
//         <p className="text-slate-500 mt-1">
//           {isAdmin
//             ? "Pantau statistik dan performa keseluruhan portal berita Histora Post."
//             : "Pantau performa artikel-artikel yang telah Anda publikasikan."}
//         </p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card className="border-slate-200 shadow-sm">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-slate-500">
//               Total Artikel Publish
//             </CardTitle>
//             <FileText className="h-4 w-4 text-[#0f172a]" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-slate-900">
//               {totalArticles}
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-slate-200 shadow-sm">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-slate-500">
//               Total Pembaca (Views)
//             </CardTitle>
//             <Eye className="h-4 w-4 text-[#0f172a]" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-slate-900">
//               {totalViews.toLocaleString("id-ID")}
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-slate-200 shadow-sm">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-slate-500">
//               Kategori Terpopuler
//             </CardTitle>
//             <TrendingUp className="h-4 w-4 text-[#0f172a]" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-xl font-bold text-slate-900 line-clamp-1">
//               {topCategory}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Tampilkan card penulis aktif HANYA JIKA yang login adalah ADMIN */}
//         {isAdmin && (
//           <Card className="border-slate-200 shadow-sm">
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-slate-500">
//                 Total Redaktur
//               </CardTitle>
//               <Users className="h-4 w-4 text-[#0f172a]" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-slate-900">
//                 {activeWritersCount}
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>

//       {/* Tabel 5 Artikel Terbaru */}
//       <div className="mt-6">
//         <Card className="border-slate-200 shadow-sm">
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle className="text-[#0f172a]">5 Artikel Terbaru</CardTitle>
//             <Link href="/dashboard/articles">
//               <Button variant="outline" size="sm">
//                 Lihat Semua
//               </Button>
//             </Link>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader className="bg-slate-50">
//                 <TableRow>
//                   <TableHead className="font-semibold text-slate-700">
//                     Judul Artikel
//                   </TableHead>
//                   <TableHead className="font-semibold text-slate-700">
//                     Kategori
//                   </TableHead>
//                   {isAdmin && (
//                     <TableHead className="font-semibold text-slate-700">
//                       Penulis
//                     </TableHead>
//                   )}
//                   <TableHead className="text-right font-semibold text-slate-700">
//                     Tanggal
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {recentArticles.length === 0 ? (
//                   <TableRow>
//                     <TableCell
//                       colSpan={isAdmin ? 4 : 3}
//                       className="text-center h-24 text-slate-500"
//                     >
//                       Belum ada artikel yang dipublish.
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   recentArticles.map((article) => (
//                     <TableRow key={article.id} className="hover:bg-slate-50/50">
//                       <TableCell className="font-medium text-[#0f172a]">
//                         <span className="line-clamp-1">{article.title}</span>
//                       </TableCell>
//                       <TableCell>
//                         <Badge>{article.category}</Badge>
//                       </TableCell>
//                       {isAdmin && (
//                         <TableCell className="text-slate-600">
//                           {article.author?.name || "Tidak diketahui"}
//                         </TableCell>
//                       )}
//                       <TableCell className="text-right text-slate-600 text-sm">
//                         {article.createdAt.toLocaleDateString("id-ID", {
//                           day: "numeric",
//                           month: "short",
//                           year: "numeric",
//                         })}
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

import { auth } from "@/app/actions/auth"; // Sesuaikan path ini jika di tempatmu importnya dari "@/app/actions/auth"
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, TrendingUp, Users, Eye, Activity } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function DashboardOverview() {
  // 1. Ambil session user yang sedang login
  const session = await auth();
  const user = session?.user;

  if (!user) return null; // Fallback aman jika belum login

  const isAdmin = user.role === "ADMIN";

  // 2. Buat kondisi query: Admin ambil semua, Redaktur ambil miliknya sendiri
  const articleCondition = isAdmin ? {} : { authorId: user.id };

  // 3. FETCH DATA PRISMA SECARA PARALEL (Performa maksimal)
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
      take: 1,
    }),

    // D. Menghitung jumlah Redaktur (Hanya dieksekusi jika yang login Admin)
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
  const avgViews =
    totalArticles > 0 ? Math.round(totalViews / totalArticles) : 0;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header Responsif */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">
          Halo, {user.name}! 👋
        </h2>
        <p className="text-slate-500 text-sm md:text-base">
          {isAdmin
            ? "Pantau statistik dan performa keseluruhan portal berita Histora Post."
            : "Pantau performa artikel-artikel yang telah Anda publikasikan."}
        </p>
      </div>

      {/* Stats Cards Responsif (1 kolom HP, 2 kolom Tablet, 4 kolom PC) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="border-slate-200 shadow-sm h-36">
          <CardHeader className="flex flex-col items-center justify-between md:pb-2 space-y-0">
            <CardTitle className="text-center text-sm font-medium text-slate-500">
              Total Artikel Publish
            </CardTitle>
            <div className="p-1 md:p-2 bg-blue-50 text-blue-600 rounded-md">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center text-xl md:text-2xl font-bold text-slate-900">
              {totalArticles}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm h-36">
          <CardHeader className="flex flex-col items-center justify-between md:pb-2 space-y-0">
            <CardTitle className="text-center text-sm font-medium text-slate-500">
              Total Pembaca (Views)
            </CardTitle>
            <div className="p-1 md:p-2 bg-emerald-50 text-emerald-600 rounded-md">
              <Eye className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center text-xl md:text-2xl font-bold text-slate-900">
              {totalViews.toLocaleString("id-ID")}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm h-36">
          <CardHeader className="flex flex-col items-center justify-between md:pb-2 space-y-0">
            <CardTitle className="text-center text-sm font-medium text-slate-500">
              Kategori Terpopuler
            </CardTitle>
            <div className="p-1 md:p-2 bg-amber-50 text-amber-600 rounded-md">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center text-xl md:text-2xl font-bold text-slate-900 line-clamp-1">
              {topCategory}
            </div>
          </CardContent>
        </Card>

        {/* Card ke-4 Dinamis: Admin lihat Redaktur, Redaktur lihat Rata-rata Views */}
        {isAdmin ? (
          <Card className="border-slate-200 shadow-sm h-36">
            <CardHeader className="flex flex-col items-center justify-between md:pb-2 space-y-0">
              <CardTitle className="text-center text-sm font-medium text-slate-500">
                Total Redaktur Aktif
              </CardTitle>
              <div className="p-1 md:p-2 bg-indigo-50 text-indigo-600 rounded-md">
                <Users className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center text-xl md:text-2xl font-bold text-slate-900">
                {activeWritersCount}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-slate-200 shadow-sm h-36">
            <CardHeader className="flex flex-col items-center justify-between md:pb-2 space-y-0">
              <CardTitle className="text-center text-sm font-medium text-slate-500">
                Rata-rata Views
              </CardTitle>
              <div className="p-1 md:p-2 bg-purple-50 text-purple-600 rounded-md">
                <Activity className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center text-xl md:text-2xl font-bold text-slate-900">
                {avgViews.toLocaleString("id-ID")}{" "}
                <span className="text-sm font-normal text-slate-500">
                  / artikel
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabel 5 Artikel Terbaru */}
      <div className="mt-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[#0f172a] text-lg sm:text-xl">
              5 Artikel Terbaru
            </CardTitle>
            <Link href="/dashboard/articles">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Lihat Semua
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 sm:pt-0">
            <Table className=" w-full table-auto min-w-150">
              <TableHeader className="bg-slate-50 ">
                <TableRow>
                  <TableHead className="w-[60%] pl-4 font-semibold text-slate-700">
                    Judul Artikel
                  </TableHead>
                  <TableHead className=" hidden md:table-cell font-semibold text-slate-700">
                    Kategori
                  </TableHead>
                  {isAdmin && (
                    <TableHead className="hidden lg:table-cell text-center font-semibold text-slate-700">
                      Penulis
                    </TableHead>
                  )}
                  <TableHead className=" hidden lg:table-cell pr-4 text-right font-semibold text-slate-700">
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
                      <TableCell className="pl-4 font-medium text-[#0f172a] max-w-50 truncate">
                        <span className="line-clamp-1 truncate">{article.title}</span>
                        <span className="block md:hidden text-xs text-slate-400 mt-1">
                          {article.createdAt.toLocaleDateString("id-ID")}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant="secondary"
                          className="bg-blue-200 text-blue-900 hover:bg-blue-300"
                        >
                          {article.category}
                        </Badge>
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="hidden lg:table-cell text-center text-slate-600">
                          {article.author?.name || "Unknown"}
                        </TableCell>
                      )}
                      <TableCell className="hidden lg:table-cell pr-4 text-right text-slate-600 text-sm whitespace-nowrap">
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
            {/* Tombol Lihat Semua versi mobile (muncul di bawah tabel jika di HP) */}
            <div className="p-4 sm:hidden border-t border-slate-100">
              <Link href="/dashboard/articles" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  Lihat Semua Artikel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
