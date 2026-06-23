"use client";

import { useTransition } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserProfile } from "@/app/actions/user";
import { UserProfile } from "@/types/user";

interface ProfileFormProps {
  user: UserProfile;
  onUpdateSuccess?: () => void;
}

export function ProfileForm({ user, onUpdateSuccess }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateUserProfile(formData);
      if (result.success) {
        toast.success(result.message);
        onUpdateSuccess?.();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={user.name}
            disabled={isPending}
            placeholder="Masukkan nama lengkap"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={user.email}
            disabled
            placeholder="Email tidak dapat diubah"
            className="bg-slate-50 text-slate-600"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Nomor Kontak</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            defaultValue={user.phoneNumber || ""}
            disabled={isPending}
            placeholder="Contoh: +62812345678"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="institution">Institusi</Label>
          <Input
            id="institution"
            name="institution"
            type="text"
            defaultValue={user.institution || ""}
            disabled={isPending}
            placeholder="Contoh: Media Berita XYZ"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-[#0f172a] hover:bg-slate-800 text-white gap-2"
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
