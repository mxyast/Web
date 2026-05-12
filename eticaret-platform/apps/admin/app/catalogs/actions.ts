"use server";

import { prisma } from "@eticaret/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCatalogTemplate(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;
  const brandId = formData.get("brandId") as string;
  const categoryId = formData.get("categoryId") as string;
  const includedProductIdsRaw = formData.get("includedProductIds") as string;
  
  if (!name || !type) {
    throw new Error("İsim ve tip zorunludur.");
  }

  await (prisma as any).catalogTemplate.create({
    data: {
      name,
      description,
      type,
      brandId: brandId || null,
      categoryId: categoryId || null,
      includedProductIds: includedProductIdsRaw ? JSON.parse(includedProductIdsRaw) : [],
      isActive: true,
    }
  });

  revalidatePath("/catalogs");
  redirect("/catalogs?success=created");
}

export async function deleteCatalogTemplate(id: string) {
  await (prisma as any).catalogTemplate.delete({
    where: { id }
  });
  
  revalidatePath("/catalogs");
  redirect("/catalogs?success=deleted");
}

export async function getProductsForCatalog(brandId?: string, categoryId?: string) {
  const whereClause: any = { isB2B: true, isActive: true };
  if (brandId) whereClause.brandId = brandId;
  if (categoryId) whereClause.categoryId = categoryId;
  
  const data = await prisma.product.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      variants: {
        select: {
          sku: true,
          images: true
        },
        take: 1
      }
    },
    orderBy: { name: 'asc' }
  });
  return data;
}
