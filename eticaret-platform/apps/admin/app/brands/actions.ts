"use server";

import { prisma } from "@eticaret/database";
import { revalidatePath } from "next/cache";
import { checkAdminAccess } from "../../auth";
import { logAdminAction } from "../utils/audit";

export async function createBrand(formData: FormData) {
  await checkAdminAccess();

  const name = formData.get("name") as string;

  if (!name || name.trim() === "") {
    throw new Error("Marka adı boş olamaz.");
  }

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric except spaces/hyphens
    .replace(/[\s_]+/g, "-") // replace spaces/underscores with hyphens
    .replace(/-+/g, "-") // remove duplicate hyphens
    + "-" + Date.now().toString().slice(-4);

  try {
    const brand = await prisma.brand.create({
      data: {
        name: name.trim(),
        slug,
      },
    });
    await logAdminAction(
      "CREATE_BRAND",
      "Brand",
      brand.id,
      `"${brand.name}" isimli yeni marka oluşturuldu.`
    );
  } catch (error) {
    console.error("Marka oluşturulurken hata:", error);
    throw new Error("Marka oluşturulamadı.");
  }

  revalidatePath("/brands");
}
