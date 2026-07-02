"use server";

import { prisma } from "@eticaret/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { checkAdminAccess } from "../../auth";

async function processImages(formData: FormData, existingImages: string[], productName: string) {
  const imageUrls = formData.getAll("imageUrls") as string[];
  const imageFiles = formData.getAll("imageFiles") as File[];
  
  const processedImages: string[] = [...existingImages, ...imageUrls.filter(url => url.trim() !== '')];

  const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  for (const file of imageFiles) {
    if (file.size > 0) {
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`Dosya boyutu çok büyük. Maksimum 5MB yüklenebilir: ${file.name}`);
      }

      const fileExt = path.extname(file.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
        throw new Error(`Geçersiz dosya tipi. Yalnızca görsel yükleyebilirsiniz: ${file.name}`);
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
      
      await writeFile(filepath, buffer);
      processedImages.push(`/api/uploads/${filename}`);
    }
  }

  // Remove duplicate images to be safe
  const uniqueImages = Array.from(new Set(processedImages));

  if (uniqueImages.length === 0) {
     uniqueImages.push("https://placehold.co/800x800/F9F9F9/111827?text=" + encodeURIComponent(productName));
  }

  return uniqueImages;
}

export async function createProduct(formData: FormData) {
  await checkAdminAccess();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  
  let brandId = formData.get("brandId") as string;
  const newBrandName = formData.get("newBrandName") as string;
  
  let categoryId = formData.get("categoryId") as string;
  const newCategoryName = formData.get("newCategoryName") as string;
  
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
  
  const isB2C = formData.get("isB2C") === "on";
  const isB2B = formData.get("isB2B") === "on";

  const variantsJson = formData.get("variantsJson") as string;
  const variantsData = variantsJson ? JSON.parse(variantsJson) : [];
  
  const retailPrice = Math.max(0, Number(formData.get("retailPrice")) || 0);
  const listA = Math.max(0, Number(formData.get("listA")) || 0);
  const listB = Math.max(0, Number(formData.get("listB")) || 0);
  const listC = Math.max(0, Number(formData.get("listC")) || listB);
  const listD = Math.max(0, Number(formData.get("listD")) || listB);
  const taxRate = Math.max(0, Number(formData.get("taxRate")) || 20);
  
  const b2cReserveRatio = Math.max(0, Math.min(100, Number(formData.get("b2cReserveRatio")) || 0));

  try {
    if (newBrandName) {
      const newBrand = await prisma.brand.create({
        data: {
          name: newBrandName,
          slug: newBrandName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4),
        }
      });
      brandId = newBrand.id;
    }

    if (newCategoryName) {
      const newCategory = await prisma.category.create({
        data: {
          name: newCategoryName,
          slug: newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4),
        }
      });
      categoryId = newCategory.id;
    }

    const processedImages = await processImages(formData, [], name);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        brandId,
        categoryId,
        isB2C,
        isB2B,
      }
    });

    for (const vData of variantsData) {
      const variant = await prisma.variant.create({
        data: {
          productId: product.id,
          sku: vData.sku,
          barcode: vData.barcode || null,
          color: vData.color || null,
          images: processedImages,
        }
      });

      await prisma.price.create({
        data: {
          variantId: variant.id,
          retailPrice,
          listA,
          listB,
          listC,
          listD,
          taxRate,
        }
      });

      await prisma.inventory.create({
        data: {
          variantId: variant.id,
          totalStock: Number(vData.totalStock) || 0,
          b2cReserveRatio,
        }
      });
    }

  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Ürün oluşturulurken bir hata oluştu.");
  }

  revalidatePath("/products");
  redirect("/products?success=created");
}

export async function updateProduct(productId: string, variantId: string, formData: FormData) {
  await checkAdminAccess();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  
  let brandId = formData.get("brandId") as string;
  const newBrandName = formData.get("newBrandName") as string;
  
  let categoryId = formData.get("categoryId") as string;
  const newCategoryName = formData.get("newCategoryName") as string;
  
  const isB2C = formData.get("isB2C") === "on";
  const isB2B = formData.get("isB2B") === "on";

  const variantsJson = formData.get("variantsJson") as string;
  const variantsData = variantsJson ? JSON.parse(variantsJson) : [];
  
  const retailPrice = Math.max(0, Number(formData.get("retailPrice")) || 0);
  const listA = Math.max(0, Number(formData.get("listA")) || 0);
  const listB = Math.max(0, Number(formData.get("listB")) || 0);
  const listC = Math.max(0, Number(formData.get("listC")) || listB);
  const listD = Math.max(0, Number(formData.get("listD")) || listB);
  const taxRate = Math.max(0, Number(formData.get("taxRate")) || 20);
  
  const b2cReserveRatio = Math.max(0, Math.min(100, Number(formData.get("b2cReserveRatio")) || 0));

  try {
    if (newBrandName) {
      const newBrand = await prisma.brand.create({
        data: {
          name: newBrandName,
          slug: newBrandName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4),
        }
      });
      brandId = newBrand.id;
    }

    if (newCategoryName) {
      const newCategory = await prisma.category.create({
        data: {
          name: newCategoryName,
          slug: newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4),
        }
      });
      categoryId = newCategory.id;
    }

    // Parse existing images that were kept
    const keptImagesJson = formData.get("keptImages") as string;
    const keptImages = keptImagesJson ? JSON.parse(keptImagesJson) : [];

    // Find and delete files that are no longer kept
    const oldVariants = await prisma.variant.findMany({
      where: { productId },
      select: { images: true }
    });
    const oldImages = Array.from(new Set(oldVariants.flatMap(v => v.images)));
    const deletedImages = oldImages.filter(img => 
      img.startsWith('/uploads/') && 
      !img.includes('..') && 
      !keptImages.includes(img)
    );

    for (const imgPath of deletedImages) {
      try {
        const filepath = path.join(process.cwd(), 'public', imgPath);
        await unlink(filepath);
      } catch (err) {
        console.error(`Failed to delete orphaned image: ${imgPath}`, err);
      }
    }

    const processedImages = await processImages(formData, keptImages, name);

    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        brandId,
        categoryId,
        isB2C,
        isB2B,
      }
    });

    const existingVariants = await prisma.variant.findMany({
      where: { productId }
    });
    const existingIds = existingVariants.map(ev => ev.id);
    const updatedIds: string[] = [];

    for (const vData of variantsData) {
      if (vData.id) {
        updatedIds.push(vData.id);
        await prisma.variant.update({
          where: { id: vData.id },
          data: {
            sku: vData.sku,
            barcode: vData.barcode || null,
            color: vData.color || null,
            images: processedImages,
          }
        });

        await prisma.price.upsert({
          where: { variantId: vData.id },
          update: {
            retailPrice,
            listA,
            listB,
            listC,
            listD,
            taxRate,
          },
          create: {
            variantId: vData.id,
            retailPrice,
            listA,
            listB,
            listC,
            listD,
            taxRate,
          }
        });

        await prisma.inventory.upsert({
          where: { variantId: vData.id },
          update: {
            totalStock: Number(vData.totalStock) || 0,
            b2cReserveRatio,
          },
          create: {
            variantId: vData.id,
            totalStock: Number(vData.totalStock) || 0,
            b2cReserveRatio,
          }
        });
      } else {
        const newVar = await prisma.variant.create({
          data: {
            productId,
            sku: vData.sku,
            barcode: vData.barcode || null,
            color: vData.color || null,
            images: processedImages,
          }
        });

        await prisma.price.create({
          data: {
            variantId: newVar.id,
            retailPrice,
            listA,
            listB,
            listC,
            listD,
            taxRate,
          }
        });

        await prisma.inventory.create({
          data: {
            variantId: newVar.id,
            totalStock: Number(vData.totalStock) || 0,
            b2cReserveRatio,
          }
        });
      }
    }

    const toDeleteIds = existingIds.filter(id => !updatedIds.includes(id));
    if (toDeleteIds.length > 0) {
      await prisma.variant.deleteMany({
        where: { id: { in: toDeleteIds } }
      });
    }

  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Ürün güncellenirken bir hata oluştu.");
  }

  revalidatePath("/products");
  redirect("/products?success=updated");
}
