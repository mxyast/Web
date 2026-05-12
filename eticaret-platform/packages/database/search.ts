import { prisma } from "./index";
import { Prisma } from "@prisma/client";

export interface SearchFilters {
  query?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  platform: "B2C" | "B2B";
  skip?: number;
  take?: number;
}

/**
 * Advanced product search with multi-criteria filtering
 */
export async function searchProducts(filters: SearchFilters) {
  const { query, categoryId, brandId, minPrice, maxPrice, platform, skip = 0, take = 20 } = filters;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(platform === "B2C" ? { isB2C: true } : { isB2B: true }),
    ...(categoryId && { categoryId }),
    ...(brandId && { brandId }),
    ...(query && {
      OR: [
        { name: { contains: query, mode: "insensitive" as Prisma.QueryMode } },
        { description: { contains: query, mode: "insensitive" as Prisma.QueryMode } },
        { 
          variants: { 
            some: { 
              sku: { contains: query, mode: "insensitive" as Prisma.QueryMode } 
            } 
          } 
        }
      ]
    })
  };

  // Note: Price filtering is complex because prices are in the Variant -> Price relation.
  // For simplicity in this mock/initial version, we'll fetch products and their variants.
  const products = await prisma.product.findMany({
    where,
    include: {
      brand: true,
      category: true,
      variants: {
        include: {
          price: true,
          inventory: true
        }
      }
    },
    skip,
    take,
    orderBy: { createdAt: "desc" }
  });

  return products;
}

/**
 * Fetches search suggestions for autocomplete
 */
export async function getSearchSuggestions(query: string, platform: "B2C" | "B2B") {
  if (!query || query.length < 2) return [];

  return await prisma.product.findMany({
    where: {
      isActive: true,
      ...(platform === "B2C" ? { isB2C: true } : { isB2B: true }),
      OR: [
        { name: { contains: query, mode: "insensitive" as Prisma.QueryMode } },
        { variants: { some: { sku: { contains: query, mode: "insensitive" as Prisma.QueryMode } } } }
      ]
    },
    select: {
      id: true,
      name: true,
      slug: true
    },
    take: 5
  });
}
