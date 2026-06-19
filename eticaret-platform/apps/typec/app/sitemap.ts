import { MetadataRoute } from 'next';
import { prisma } from '@eticaret/database';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://typec.com.tr";

  // Statik Sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/deals`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // Dinamik Ürün Sayfaları
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      isB2C: true,
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...productPages];
}
