"use client";

import { useTransition } from "react";
import { Lock, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/app/actions/user";

export default function SettingsPage() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPass = formData.get("newPassword") as string;
    const confirmPass = formData.get("confirmPassword") as string;

    // Validasi sederhana di sisi client
    if (newPass !== confirmPass) {
      return toast.error("Konfirmasi password baru tidak cocok!");
    }

    if (newPass.length < 8) {
      return toast.error("Password baru minimal 8 karakter!");
    }

    startTransition(async () => {
      const result = await changePassword(formData);
      if (result.success) {
        toast.success(result.message);
        (e.target as HTMLFormElement).reset(); // Bersihkan form
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0f172a]">Pengaturan Akun</h2>
        <p className="text-slate-500 text-sm mt-1">Perbarui keamanan akun kamu di Histora Post.</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-4">
            <Lock size={18} className="text-slate-500" />
            <h3 className="font-semibold text-slate-700">Ganti Password</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentPassword">Password Saat Ini</Label>
            <Input 
              id="currentPassword" 
              name="currentPassword" 
              type="password" 
              required 
              placeholder="Masukkan password lama"
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
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button 
              type="submit" 
              disabled={isPending}
              className="bg-[#0f172a] hover:bg-slate-800 text-white gap-2"
            >
              {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isPending ? "Memproses..." : "Update Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}