"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  User as UserIcon,
  UserPen,
  Mail,
  Phone,
  Building2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import {
  ChangePasswordDialog,
  ProfileImageUploader,
  ProfileForm,
} from "@/components/profile";
import { getUserProfile } from "@/app/actions/user";
import { UserProfile } from "@/types/user";

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { update: updateSession } = useSession();

  const loadUserProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getUserProfile();
      if (result.success && result.data) {
        setUser(result.data);
        await updateSession({
          name: result.data.name,
          profileImageUrl: result.data.profileImageUrl,
        });
      } else {
        toast.error(result.message || "Gagal memuat profil");
        setUser(null);
      }
    } catch {
      toast.error("Terjadi kesalahan saat memuat profil");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [updateSession]);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        <div className="flex items-center justify-center h-96">
          <Loader2 size={32} className="animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        <div className="text-center">
          <p className="text-slate-500">Data profil tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-[#0f172a] flex items-center gap-2">
          <UserIcon size={32} className="text-slate-600" />
          Profil Saya
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Kelola informasi akun dan pengaturan keamanan Anda
        </p>
      </div>

      {/* Main Profile Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar - Foto Profil */}
        <div className="md:col-span-1">
          <Card className="p-6 border border-slate-200 shadow-sm">
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <UserIcon size={18} className="text-slate-600" />
                Foto Profil
              </h3>
              <ProfileImageUploader
                currentImageUrl={user.profileImageUrl}
                userName={user.name}
                onUploadSuccess={loadUserProfile}
              />
            </div>
          </Card>

          {/* Quick Info Card */}
          <Card className="mt-6 p-6 border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4">
              Informasi Cepat
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Mail size={16} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-slate-600">Email</p>
                  <p className="font-medium text-slate-900 break-all">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <UserIcon
                  size={16}
                  className="text-slate-400 mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-slate-600">Role</p>
                  <p className="font-medium text-slate-900 capitalize">
                    {user.role === "ADMIN" ? "Administrator" : "Redaktur"}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Informasi Profil */}
          <Card className="p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-4 border-b border-slate-100">
              Informasi Profil
            </h3>

            <div className="grid grid-cols-1 gap-4 mb-6">
              {/* Nama */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <UserPen size={16} className="text-slate-400" />
                  <p className="text-sm text-slate-600">Nama Lengkap</p>
                </div>
                <p className="text-base font-medium text-slate-900 ml-6">
                  {user.name}
                </p>
              </div>

              {/* Nomor Kontak */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Phone size={16} className="text-slate-400" />
                  <p className="text-sm text-slate-600">Nomor Kontak</p>
                </div>
                <p className="text-base font-medium text-slate-900 ml-6">
                  {user.phoneNumber || "-"}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 size={16} className="text-slate-400" />
                  <p className="text-sm text-slate-600">Institusi</p>
                </div>
                <p className="text-base font-medium text-slate-900 ml-6">
                  {user.institution || "-"}
                </p>
              </div>
            </div>

            {/* Edit Form */}
            <div className="border-t border-slate-100 pt-6">
              <h4 className="font-semibold text-slate-900 mb-4">
                Edit Informasi
              </h4>
              <ProfileForm user={user} onUpdateSuccess={loadUserProfile} />
            </div>
          </Card>

          <Card className="p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-4 border-b border-slate-100">
              Keamanan Akun
            </h3>

            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Kelola password akun Anda untuk menjaga keamanan.
              </p>
              <ChangePasswordDialog />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
