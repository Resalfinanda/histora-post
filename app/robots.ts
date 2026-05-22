import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://historapost.com';

  return {
    rules: {
      userAgent: '*', 
      allow: '/',
      disallow: ['/dashboard', '/api','/actions','/search'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}