"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { updateProfileImage } from "@/app/actions/user";

interface ProfileImageUploaderProps {
  currentImageUrl?: string | null;
  userName: string;
  onUploadSuccess?: () => void;
}

export function ProfileImageUploader({
  currentImageUrl,
  userName,
  onUploadSuccess,
}: ProfileImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      toast.error("Pilih file gambar yang valid");
      return;
    }


    if (file.size > 1 * 1024 * 1024) {
      toast.error("Ukuran gambar tidak boleh lebih dari 1MB");
      return;
    }

    // Tampilkan preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      // Upload ke Supabase
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from("Image-profile")
        .upload(fileName, file);

      if (error) {
        throw new Error(error.message);
      }

      // Dapatkan public URL
      const { data: publicUrlData } = supabase.storage
        .from("Image-profile")
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;

      // Update di database
      const result = await updateProfileImage(imageUrl);
      if (result.success) {
        toast.success("Foto profil berhasil diperbarui!");
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        onUploadSuccess?.();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Gagal mengunggah foto profil");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const imageToDisplay = previewUrl || currentImageUrl;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-24 h-24">
        {imageToDisplay ? (
          <Image
            src={imageToDisplay}
            alt={userName}
            fill
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            <span className="text-2xl font-bold text-slate-600">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          variant="outline"
          className="gap-2 border-slate-200 hover:bg-slate-50"
        >
          {isUploading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Upload size={16} />
          )}
          {isUploading ? "Mengunggah..." : "Ubah Foto"}
        </Button>
        {currentImageUrl && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={isUploading}
            className="border-slate-200 hover:bg-red-50 hover:text-red-600"
          >
            <X size={16} />
          </Button>
        )}
      </div>

      <p className="text-xs text-slate-500">
        Maksimal 1MB, format: JPG, PNG.
      </p>
    </div>
  );
}
