export const STORAGE_BUCKETS = {
  profile: "Image-profile",
  article: "article-images",
  advertisement: "iklan",
} as const;

export const IMAGE_MAX_SIZE = 1 * 1024 * 1024;

export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;