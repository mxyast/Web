"use server";

import { prisma } from "@eticaret/database";
import { revalidatePath } from "next/cache";
import { checkAdminAccess } from "../../auth";
import { logAdminAction } from "../utils/audit";

export async function createCategory(formData: FormData) {
  await checkAdminAccess();

  const name = formData.get("name") as string;
  const parentId = formData.get("parentId") as string;

  if (!name || name.trim() === "") {
    throw new Error("Kategori adı boş olamaz.");
  }

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric except spaces/hyphens
    .replace(/[\s_]+/g, "-") // replace spaces/underscores with hyphens
    .replace(/-+/g, "-") // remove duplicate hyphens
    + "-" + Date.now().toString().slice(-4);

  try {
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        parentId: parentId && parentId !== "" ? parentId : null,
      },
    });
    await logAdminAction(
      "CREATE_CATEGORY",
      "Category",
      category.id,
      `"${category.name}" isimli yeni ${parentId ? "alt " : "ana "}kategori oluşturuldu.`
    );
  } catch (error) {
    console.error("Kategori oluşturulurken hata:", error);
    throw new Error("Kategori oluşturulamadı.");
  }

  revalidatePath("/categories");
}
