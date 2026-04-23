"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUser } from "@/app/actions/user";

export default function CreateUserPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createUser(formData);
      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/users");
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/users">
          <Button variant="outline" size="icon" className="h-8 w-8"><ArrowLeft size={16} /></Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-[#0f172a]">Tambah Pengguna Baru</h2>
          <p className="text-slate-500 text-sm mt-1">Buat akun untuk tim redaksi atau admin baru.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" name="name" required placeholder="John Doe" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Login</Label>
            <Input id="email" name="email" type="email" required placeholder="johndoe@historapost.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password Default</Label>
            <Input id="password" name="password" type="password" required placeholder="Minimal 8 karakter" minLength={8} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Hak Akses (Role)</Label>
            <select 
              id="role" 
              name="role" 
              required
              className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm"
            >
              <option value="REDAKTUR">Redaktur (Penulis Konten)</option>
              <option value="ADMIN">Admin (Akses Penuh)</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link href="/dashboard/users">
              <Button type="button" variant="outline" disabled={isPending}>Batal</Button>
            </Link>
            <Button type="submit" disabled={isPending} className="bg-[#0f172a] hover:bg-slate-800 text-white gap-2">
              {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Simpan Pengguna
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}