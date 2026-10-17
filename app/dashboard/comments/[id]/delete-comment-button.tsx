"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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

export function DeleteCommentButton({ commentId }: { commentId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus komentar.");
      }

      toast.success("Komentar berhasil dihapus.");
      router.push("/dashboard/comments");
      router.refresh();
    } catch (error) {
      console.error("Gagal menghapus komentar:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menghapus komentar.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-red-600 text-white hover:bg-red-700">
          <Trash2 className="mr-1 h-4 w-4" />
          Hapus Komentar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus komentar ini?</AlertDialogTitle>
          <AlertDialogDescription>
            Komentar akan dihapus secara permanen dan tidak dapat dipulihkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting ? "Menghapus..." : "Ya, Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
