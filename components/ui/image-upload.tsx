// components/ui/image-upload.tsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";
import { toast } from "sonner"; // Import toast untuk memunculkan notifikasi error

interface ImageUploadProps {
  name: string;
  defaultValue?: string | null; // Opsional, untuk menampilkan gambar lama saat edit
}

export function ImageUpload({ name, defaultValue }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultValue || null);
  const inputRef = useRef<HTMLInputElement>(null);

  // BATAST UKURAN: 1 MB (dalam bytes)
  const MAX_FILE_SIZE = 1 * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // 1. Cek ukuran file
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Ukuran gambar terlalu besar! Maksimal 1 MB.");

        // Reset input file agar gambar yang kebesaran tidak ikut tersubmit
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        return; // Hentikan fungsi di sini
      }

      // 2. Jika aman, buat preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        id={name}
        name={name}
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
          <Image
            src={previewUrl}
            alt="Preview upload"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full flex items-center gap-2 transition-transform transform scale-95 group-hover:scale-100"
            >
              <X size={20} />
              <span className="text-sm font-medium pr-1">Hapus Gambar</span>
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={name}
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-[#0f172a]/50 transition-all"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
            <div className="p-4 bg-white rounded-full shadow-sm mb-4 border border-slate-100">
              <UploadCloud className="w-8 h-8 text-[#0f172a]" />
            </div>
            <p className="mb-2 text-sm font-semibold text-slate-700">
              Klik untuk memilih gambar
            </p>
            <p className="text-xs text-gray-800 font-medium">
              Mendukung JPG, PNG, WEBP (Maksimal 1 MB)
            </p>
          </div>
        </label>
      )}
    </div>
  );
}
