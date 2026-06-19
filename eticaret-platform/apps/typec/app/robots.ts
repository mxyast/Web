import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://typec.com.tr";

  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/products',
        '/product/*',
        '/deals'
      ],
      disallow: [
        '/cart',
        '/checkout',
        '/orders',
        '/profile',
        '/wishlist',
        '/auth/*',
        '/api/*'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
