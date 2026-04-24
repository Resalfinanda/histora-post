"use client";

import { useEffect } from "react";


export default function ArticleTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug) {
      console.error("Slug undefined");
      return;
    }
    // Memanggil API tanpa perlu menunggu (fire and forget)
    fetch(`/api/articles/${slug}/view`, {
      method: "POST",
    }).catch(err => console.error("Gagal mencatat view", err));
  }, [slug]);

  return null; // Komponen ini tidak me-render apa-apa, hanya untuk tracking
}