import { supabaseServer } from "@/lib/supabase-server";
import type { STORAGE_BUCKETS } from "@/lib/storage/constants";

type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

function getExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return extension && /^[a-z0-9]+$/.test(extension) ? extension : "jpg";
}

export async function uploadImage(
  file: File,
  bucket: StorageBucket,
  folder?: string,
) {
  const filePath = `${folder ? `${folder.replace(/\/$/, "")}/` : ""}${
    crypto.randomUUID()
  }.${getExtension(file)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabaseServer.storage
    .from(bucket)
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabaseServer.storage.from(bucket).getPublicUrl(filePath);
  return { path: filePath, url: data.publicUrl };
}