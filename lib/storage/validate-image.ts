import {
  IMAGE_MAX_SIZE,
  IMAGE_MIME_TYPES,
} from "@/lib/storage/constants";

export function validateImageFile(file: unknown): string | null {
  if (!(file instanceof File)) {
    return "File tidak ditemukan";
  }

  if (!IMAGE_MIME_TYPES.includes(file.type as (typeof IMAGE_MIME_TYPES)[number])) {
    return "Tipe file tidak valid. Hanya JPEG, PNG, GIF, dan WebP yang diizinkan.";
  }

  if (file.size > IMAGE_MAX_SIZE) {
    return "Ukuran gambar tidak boleh lebih dari 1MB";
  }

  return null;
}