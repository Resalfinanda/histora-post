"use client";

import { useEffect } from "react";

export function ArticleTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug) {
      console.error("Slug undefined");
      return;
    }

    fetch(`/api/articles/${slug}/view`, {
      method: "POST",
    }).catch((err) => console.error("Gagal mencatat view", err));
  }, [slug]);

  return null;
}
