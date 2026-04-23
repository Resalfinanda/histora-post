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
};

export default function ArticlesClient({
  articles,
  query,
  category,
  categories,
}: ArticlesClientProps) {
  const [isPending] = useTransition();

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Daftar Artikel</h2>
        <Link href="/dashboard/articles/create">
          <Button>
            <Plus size={16} /> Tambah
          </Button>
        </Link>
      </div>

      {/* SEARCH & FILTER */}
      <form method="GET" className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 w-4 h-4" />
          <Input
            name="query"
            placeholder="Cari artikel..."
            defaultValue={query}
            className="pl-8"
          />
        </div>

        <select name="category" defaultValue={category}>
          <option value="all">Semua</option>

          {categories.map((c) => (
            <option key={c.category} value={c.category}>
              {c.category}
            </option>
          ))}
        </select>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Loading..." : "Filter"}
        </Button>
      </form>

      {/* TABLE */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Judul</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Penulis</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {articles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Tidak ada data
              </TableCell>
            </TableRow>
          ) : (
            articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell>{article.title}</TableCell>

                <TableCell>
                  <Badge>{article.category}</Badge>
                </TableCell>

                <TableCell>{article.author?.name ?? "Unknown"}</TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      <DropdownMenuItem className="cursor-pointer" asChild>
                        <Link
                          href={`/dashboard/articles/${article.id}/edit`}
                          className="flex items-center w-full"
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit Artikel
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
  );
}
