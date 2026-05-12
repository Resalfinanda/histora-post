export const getBlurDataUrl = (color: string = "#e5e7eb") => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1">
    <rect width="1" height="1" fill="${color}"/>
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
};

export const imageSizes = {
  articleCard: "(max-width: 640px) 96px, (max-width: 1024px) 128px, 256px",

  featuredArticle:
    "(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) calc(100vw - 48px), 960px",

  featuredCarousel:
    "(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) calc(100vw - 48px), 960px",

  articleHeader:
    "(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) calc(100vw - 48px), 1000px",

  relatedArticles: "(max-width: 640px) 96px, (max-width: 1024px) 96px, 128px",

  adBanner:
    "(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) calc(100vw - 48px), 960px",
};

export const getImageLoading = (
  priority: boolean,
  isAboveFold: boolean,
): "eager" | "lazy" => {
  if (priority || isAboveFold) return "eager";
  return "lazy";
};
