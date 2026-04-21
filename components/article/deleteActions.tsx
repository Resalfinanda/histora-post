// app/(dashboard)/dashboard/articles/components/delete-action.tsx
"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteArticle } from "@/app/actions/article";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteAction({ articleId }: { articleId: string }) {
  // useTransition agar kita bisa menampilkan status loading saat server action berjalan
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteArticle(articleId);
      
      if (result.success) {
        toast.success(result.message); // Toast hijau
      } else {
        toast.error(result.message); // Toast merah
      }
    });
  };

  return (
    <AlertDialog>
      {/* asChild memastikan trigger menggunakan button di dalamnya, bukan membuat button baru */}
      <AlertDialogTrigger asChild>
        <button className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-red-50 text-red-600 focus:bg-red-50 focus:text-red-600">
          <Trash2 className="mr-2 h-4 w-4" /> Hapus
        </button>
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Artikel ini akan dihapus secara permanen dari database Histora Post.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); // Mencegah dialog langsung tertutup
              handleDelete();
            }}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
          >
            {isPending ? "Menghapus..." : "Ya, Hapus Artikel"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}