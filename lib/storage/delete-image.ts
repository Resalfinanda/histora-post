import { supabaseServer } from "@/lib/supabase-server";
import type { STORAGE_BUCKETS } from "@/lib/storage/constants";

type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

export async function deleteImage(bucket: StorageBucket, path: string) {
  const { error } = await supabaseServer.storage.from(bucket).remove([path]);
  if (error) {
    throw new Error(error.message);
  }
}

export function getStoragePath(publicUrl: string, bucket: StorageBucket) {
  const marker = `/object/public/${bucket}/`;
  const markerIndex = publicUrl.indexOf(marker);
  return markerIndex === -1
    ? null
    : decodeURIComponent(publicUrl.slice(markerIndex + marker.length));
}