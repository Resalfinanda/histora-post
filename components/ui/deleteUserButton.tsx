// components/ui/delete-user-button.tsx
"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteUser } from "@/app/actions/user";

// Import komponen Alert Dialog
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteUserButton({ userId, userName }: { userId: string, userName: string }) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah dialog tertutup otomatis sebelum proses selesai
    
    startTransition(async () => {
      const result = await deleteUser(userId);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      
      // Tutup dialog setelah proses (baik berhasil maupun gagal) selesai
      setIsOpen(false);
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Tombol Pemicu Dialog */}
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm" 
          className="bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none"
        >
          <Trash2 size={16} />
        </Button>
      </AlertDialogTrigger>
      
      {/* Isi Pop-up Dialog */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-800">
            Hapus akun pengguna?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500">
            Apakah Anda yakin ingin menghapus akses untuk <strong>{userName}</strong>? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          
          {/* Tombol Hapus Asli */}
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white min-w-25"
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Proses...
              </>
            ) : (
              "Ya, Hapus"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}