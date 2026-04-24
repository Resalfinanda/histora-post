"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react"; 
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";


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

export function LogoutButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {

      await signOut({ redirect: false });

      toast.success("Berhasil logout. Sampai jumpa kembali!");

      setIsOpen(false);

      // Arahkan ke halaman login
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("Gagal melakukan logout. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Tombol Pemicu Dialog di Sidebar */}
      <AlertDialogTrigger asChild>
        <button className="flex justify-center items-center gap-3 p-2 w-full text-left text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg font-medium transition-colors">
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </AlertDialogTrigger>

      {/* Isi Pop-up Dialog */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-800">
            Konfirmasi Logout
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500">
            Apakah Anda yakin ingin keluar dari dashboard Histora Post? Anda
            harus memasukkan email dan password kembali untuk masuk.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>

          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white min-w-30"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Keluar...
              </>
            ) : (
              "Ya, Keluar"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
