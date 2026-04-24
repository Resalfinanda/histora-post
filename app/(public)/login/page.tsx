// app/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react"; // 1. Import ikon Eye dan EyeOff

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // 2. Tambahkan state untuk mengatur visibilitas password
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error === "CredentialsSignin" 
          ? "Email atau password salah!" 
          : result.error);
      } else {
        toast.success("Login berhasil! Mengalihkan...");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error("Terjadi kesalahan yang tidak terduga.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#0f172a]">Histora Post Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="admin@historapost.com" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            {/* 3. Bungkus input dengan div relative */}
            <div className="relative">
              <Input 
                id="password" 
                name="password" 
                // 4. Ubah tipe secara dinamis berdasarkan state
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                required 
                className="pr-10" // Beri ruang di kanan agar teks tidak menabrak ikon
              />
              {/* 5. Tombol toggle posisi absolut di kanan input */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                tabIndex={-1} // Agar saat user tekan 'Tab', tidak fokus ke tombol ini melainkan ke tombol Submit
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <Button type="submit" disabled={loading} className="w-full bg-[#0f172a] text-white mt-2">
            {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
            Masuk ke Dashboard
          </Button>
        </form>
      </div>
    </div>
  );
}