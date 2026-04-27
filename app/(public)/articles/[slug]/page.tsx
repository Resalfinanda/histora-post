import { Metadata } from "next";
import ArticleClient from "./ArticleClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const res = await fetch(`${baseUrl}/api/articles/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("Not found");

    const article = await res.json();

    return {
      title: article.title,
      description: article.excerpt || "Baca artikel selengkapnya...",
      openGraph: {
        title: article.title,
        description: article.excerpt || "Baca artikel selengkapnya...",
        url: `${baseUrl}/articles/${slug}`,
        images: article.imageUrl
          ? [
              {
                url: article.imageUrl,
                width: 1200,
                height: 630,
                alt: article.title,
              },
            ]
          : [],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.excerpt || "Baca artikel selengkapnya...",
        images: article.imageUrl ? [article.imageUrl] : [],
      },
    };
  } catch (error) {
    console.error("Error fetching article metadata:", error);
    return {
      title: "Artikel Tidak Ditemukan - Histora Post",
      description:
        "Maaf, artikel yang Anda cari mungkin telah dihapus atau URL salah.",
    };
  }
}

export default async function ArticlePage({ params }: Props) {
  const resolvedParams = await params;

  // Lempar slug ke Client Component agar tidak perlu useParams lagi
  return <ArticleClient slug={resolvedParams.slug} />;
}
