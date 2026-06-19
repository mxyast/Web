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
  sort?: "new" | "popular";
}

/**
 * Türkçe karakterleri ASCII eşdeğerleriyle normalleştirir.
 * "şarj" → "sarj", "ğ" → "g", "ü" → "u" vb.
 * Bu sayede kullanıcı Türkçe karakter olmayan klavyeden de arama yapabilir.
 */
function normalizeTurkish(str: string): string {
  return str
    .toLowerCase()
    .replace(/ş/g, "s").replace(/ğ/g, "g")
    .replace(/ü/g, "u").replace(/ö/g, "o")
    .replace(/ı/g, "i").replace(/ç/g, "c")
    .replace(/Ş/g, "s").replace(/Ğ/g, "g")
    .replace(/Ü/g, "u").replace(/Ö/g, "o")
    .replace(/İ/g, "i").replace(/Ç/g, "c");
}

/**
 * Çok kelimeli sorguyu bireysel tokenlara bölüp Prisma OR koşulları oluşturur.
 * "baseus 100w" → "baseus" VE "100w" kelimelerinin ikisinin de geçtiği ürünler üste çıkar.
 */
function buildQueryConditions(query: string): Prisma.ProductWhereInput["OR"] {
  const tokens = query.trim().split(/\s+/).filter(t => t.length >= 2);
  const mode = "insensitive" as Prisma.QueryMode;

  // Tam sorgu + normalize edilmiş hali + her token için koşullar
  const allTerms = [query, normalizeTurkish(query), ...tokens].filter(Boolean);
  const unique = [...new Set(allTerms)];

  const conditions: Prisma.ProductWhereInput[] = [];
  for (const term of unique) {
    conditions.push(
      { name: { contains: term, mode } },
      { description: { contains: term, mode } },
      { brand: { name: { contains: term, mode } } },
      {
        variants: {
          some: {
            OR: [
              { sku: { contains: term, mode } },
              { barcode: { contains: term, mode } },
              { attributes: { some: { value: { contains: term, mode } } } }
            ]
          }
        }
      }
    );
  }
  return conditions;
}

/**
 * Levenshtein Distance — iki string arasındaki minimum düzenleme mesafesini döndürür.
 * Typo toleransı için kullanılır (Örn: "Besaus" → "Baseus").
 */
function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;

  // dp matrisi: (m+1) x (n+1) boyutunda, başlangıçta 0
  const dp: number[][] = [];
  for (let i = 0; i <= m; i++) {
    dp[i] = [];
    for (let j = 0; j <= n; j++) {
      dp[i]![j] = i === 0 ? j : j === 0 ? i : 0;
    }
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const charA = a[i - 1] ?? "";
      const charB = b[j - 1] ?? "";
      const prev = dp[i - 1]![j - 1]!;
      const left = dp[i]![j - 1]!;
      const top  = dp[i - 1]![j]!;

      if (charA.toLowerCase() === charB.toLowerCase()) {
        dp[i]![j] = prev;
      } else {
        dp[i]![j] = 1 + Math.min(top, left, prev);
      }
    }
  }
  return dp[m]![n]!;
}

/**
 * Sorgu için en iyi aday kelimeyi bulur.
 * Ürün isimlerini tokenize (kelime kelime) edip her token ile mesafeyi karşılaştırır.
 */
function findBestMatch(query: string, candidates: string[]): string | undefined {
  const q = query.toLowerCase().trim();
  let bestWord: string | undefined;
  let bestScore = Infinity;

  // Maksimum kabul edilebilir Levenshtein mesafesi (sorgu uzunluğunun 1/3'ü, min 2)
  const maxDist = Math.max(2, Math.floor(q.length / 3));

  for (const candidate of candidates) {
    // Her ürün adını kelimelerine böl — "Baseus GaN5 Pro" → ["Baseus", "GaN5", "Pro"]
    const tokens = candidate.split(/\s+/);
    for (const token of tokens) {
      if (token.length < 3) continue; // Çok kısa tokenleri atla
      const dist = levenshteinDistance(q, token.toLowerCase());
      // Oranlı skor: mesafeyi token uzunluğuna normalize et (daha hassas karşılaştırma)
      const normalizedScore = dist / Math.max(token.length, q.length);
      if (dist <= maxDist && normalizedScore < 0.45 && dist < bestScore) {
        bestScore = dist;
        bestWord = token;
      }
    }
  }

  return bestWord;
}

export interface SearchResult {
  products: Awaited<ReturnType<typeof runProductQuery>>;
  didYouMean?: string;
  total: number;
}

async function runProductQuery(where: Prisma.ProductWhereInput, skip: number, take: number, orderBy: any) {
  return prisma.product.findMany({
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
    orderBy
  });
}

/**
 * Advanced product search with multi-criteria filtering and "Did you mean?" typo correction.
 */
export async function searchProducts(filters: SearchFilters): Promise<SearchResult> {
  const { query, categoryId, brandId, minPrice, maxPrice, platform, skip = 0, take = 20, sort = "new" } = filters;

  let categoryCondition: Prisma.ProductWhereInput | undefined = undefined;
  if (categoryId) {
    const subCategories = await prisma.category.findMany({
      where: { parentId: categoryId },
      select: { id: true }
    });
    const categoryIds = [categoryId, ...subCategories.map(c => c.id)];
    categoryCondition = { categoryId: { in: categoryIds } };
  }

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(platform === "B2C" ? { isB2C: true } : { isB2B: true }),
    ...categoryCondition,
    ...(brandId && { brandId }),
    ...(query && {
      OR: buildQueryConditions(query)
    })
  };

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.variants = {
      ...where.variants,
      some: {
        ...(where.variants as any)?.some,
        price: {
          retailPrice: {
            ...(minPrice !== undefined && { gte: minPrice }),
            ...(maxPrice !== undefined && { lte: maxPrice }),
          }
        }
      }
    };
  }

  const orderBy = sort === "popular"
    ? { reviews: { _count: "desc" } as const }
    : { createdAt: "desc" as const };

  const products = await runProductQuery(where, skip, take, orderBy);
  const total = await prisma.product.count({ where });

  // --- "Bunu mu demek istediniz?" Mantığı ---
  // Eğer arama yapıldı ama sonuç bulunamadıysa, typo düzeltme algortimasını çalıştır
  let didYouMean: string | undefined;

  if (query && query.trim().length >= 2 && products.length === 0) {
    // Platformdaki tüm aktif ürün ve marka isimlerini al (öneri havuzu)
    const allNames = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(platform === "B2C" ? { isB2C: true } : { isB2B: true }),
      },
      select: { name: true },
      take: 500 // Bellek kullanımını sınırla
    });

    const nameCandidates = allNames.map(p => p.name);
    const suggestion = findBestMatch(query, nameCandidates);

    if (suggestion && suggestion.toLowerCase() !== query.toLowerCase()) {
      didYouMean = suggestion;
    }
  }

  return { products, didYouMean, total };
}

/**
 * Fetches search suggestions for autocomplete (instant search dropdown)
 */
export async function getSearchSuggestions(query: string, platform: "B2C" | "B2B") {
  if (!query || query.length < 2) return [];

  return await prisma.product.findMany({
    where: {
      isActive: true,
      ...(platform === "B2C" ? { isB2C: true } : { isB2B: true }),
      OR: [
        { name: { contains: query, mode: "insensitive" as Prisma.QueryMode } },
        { brand: { name: { contains: query, mode: "insensitive" as Prisma.QueryMode } } },
        { variants: { some: { sku: { contains: query, mode: "insensitive" as Prisma.QueryMode } } } }
      ]
    },
    select: {
      id: true,
      name: true,
      slug: true,
      brand: { select: { name: true } },
      variants: {
        select: { images: true },
        take: 1
      }
    },
    take: 6
  });
}
