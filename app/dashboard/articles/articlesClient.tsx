"use client";

import Link from "next/link";
import { useTransition } from "react";

import { Plus, Search, MoreHorizontal, Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArticleWithAuthor } from "@/types/article";
import { DeleteAction } from "@/components/article/deleteActions";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ArticlesClientProps = {
  articles: ArticleWithAuthor[];
  query: string;
  category: string;
  categories: { category: string }[];
  isAdmin: boolean; // 1. Tambahkan props isAdmin di sini
};

export default function ArticlesClient({
  articles,
  query,
  category,
  categories,
  isAdmin,
}: ArticlesClientProps) {
  const [isPending] = useTransition();

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0f172a]">Daftar Artikel</h2>
          <p className="text-slate-500 text-sm mt-1">
            {isAdmin
              ? "Kelola semua publikasi artikel dari seluruh redaksi."
              : "Kelola artikel yang telah Anda publikasikan."}
          </p>
        </div>
        <Link href="/dashboard/articles/create" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-[#0f172a] text-white hover:bg-slate-800 gap-2">
            <Plus size={16} /> Tambah Artikel
          </Button>
        </Link>
      </div>

      {/* SEARCH & FILTER */}
      <form method="GET" className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            name="query"
            placeholder="Cari judul artikel..."
            defaultValue={query}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <select
            name="category"
            defaultValue={category}
            className="flex h-8 w-full sm:w-48 rounded-md border border-slate-300 bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.category} value={c.category}>
                {c.category}
              </option>
            ))}
          </select>

          <Button
            type="submit"
            disabled={isPending}
            variant="outline"
            className="w-20 shrink-0 bg-[#0f172a] text-white"
          >
            {isPending ? "Loading..." : "Filter"}
          </Button>
        </div>
      </form>

      {/* TABLE */}
      <div className=" bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-200">
            <TableRow>
              <TableHead className="w-[60%] sm:w-[40%] pl-4">
                Judul Artikel
              </TableHead>
              <TableHead className="hidden md:table-cell">Kategori</TableHead>
              {/* 3. Kolom Penulis hanya muncul untuk Admin */}
              {isAdmin && (
                <TableHead className="hidden lg:table-cell">Penulis</TableHead>
              )}
              <TableHead className="text-right pr-8 ">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {articles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 4 : 3}
                  className="h-32 text-center text-slate-500"
                >
                  Tidak ada artikel yang ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article.id} className="hover:bg-slate-50 ">
                  <TableCell className="font-medium text-slate-800 pl-4 truncate">
                    <span className="line-clamp-2 leading-snug truncate">
                      {article.title}
                    </span>
                    <span className="block md:hidden text-xs text-slate-500 mt-1">
                      {article.category}{" "}
                      {isAdmin && `• ${article.author?.name}`}
                    </span>
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant="secondary"
                      className="bg-blue-200 text-blue-900 hover:bg-blue-300 font-bold"
                    >
                      {article.category}
                    </Badge>
                  </TableCell>

                  {/* Data Penulis hanya muncul untuk Admin */}
                  {isAdmin && (
                    <TableCell className="hidden lg:table-cell text-slate-500">
                      {article.author?.name ?? "Unknown"}
                    </TableCell>
                  )}

                  <TableCell className="text-right pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 focus-visible:ring-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Buka menu</span>
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="cursor-pointer" asChild>
                          <Link
                            href={`/dashboard/articles/${article.id}/edit`}
                            className="flex items-center w-full"
                          >
                            <Edit className="mr-2 h-4 w-4 text-slate-500" />
                            <span>Edit Artikel</span>
                          </Link>
                        </DropdownMenuItem>

                        <DeleteAction articleId={article.id} />
                      </DropdownMenuContent>
                    </DropdownMenu>
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
