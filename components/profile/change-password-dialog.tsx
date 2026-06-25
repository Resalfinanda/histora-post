"use client";

import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/app/actions/user";

export function ChangePasswordDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPass = formData.get("newPassword") as string;
    const confirmPass = formData.get("confirmPassword") as string;

    if (newPass !== confirmPass) {
      return toast.error("Konfirmasi password baru tidak cocok!");
    }

    if (newPass.length < 8) {
      return toast.error("Password baru minimal 8 karakter!");
    }

    setIsPending(true);
    try {
      const result = await changePassword(formData);
      if (result.success) {
        toast.success(result.message);
        (e.target as HTMLFormElement).reset();
        setIsOpen(false);
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-slate-200 hover:bg-slate-50"
        >
          <Lock size={16} />
          Ganti Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock size={20} className="text-slate-600" />
            Ganti Password
          </DialogTitle>
          <DialogDescription>
            Masukkan password lama dan password baru Anda untuk mengubah
            password akun.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Password Saat Ini</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              placeholder="Masukkan password lama"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Password Baru</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              placeholder="Minimal 8 karakter"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="Ulangi password baru"
              disabled={isPending}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#0f172a] hover:bg-slate-800 text-white gap-2"
            >
              {isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Lock size={16} />
              )}
              {isPending ? "Memproses..." : "Ganti Password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
