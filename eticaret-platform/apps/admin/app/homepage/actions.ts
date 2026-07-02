"use server";

import { prisma } from "@eticaret/database";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { checkAdminAccess } from "../../auth";

async function saveUploadedFile(file: File): Promise<string> {
  const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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
  const uploadDir = path.join(process.cwd(), '../../apps/typec/public/uploads');
  await mkdir(uploadDir, { recursive: true });
  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);
  return `/api/uploads/${filename}`;
}

export async function updateHomepageSection(sectionId: string, formData: FormData) {
  await checkAdminAccess();
  const title = formData.get("title") as string;
  const categoryId = (formData.get("categoryId") as string) || null;
  const isDraft = formData.get("isDraft") === "true";

  let imageUrl: string | null | undefined = undefined;
  const imageFile = formData.get("imageFile") as File | null;
  const imageUrlInput = formData.get("imageUrl") as string;

  if (imageFile && imageFile.size > 0) {
    imageUrl = await saveUploadedFile(imageFile);
  } else if (imageUrlInput) {
    imageUrl = imageUrlInput;
  }

  const data: any = { title, categoryId, isDraft };
  if (imageUrl !== undefined) data.imageUrl = imageUrl;

  await prisma.homepageSection.update({
    where: { id: sectionId },
    data,
  });

  revalidatePath("/homepage");
  revalidatePath("/");
}

export async function publishHomepageSection(sectionId: string) {
  await checkAdminAccess();
  await prisma.homepageSection.update({
    where: { id: sectionId },
    data: { isDraft: false },
  });
  revalidatePath("/homepage");
  revalidatePath("/");
}

export async function updateHomepageBanner(bannerId: string | null, formData: FormData) {
  await checkAdminAccess();
  const badge = formData.get("badge") as string;
  const title = formData.get("title") as string;
  const titleHighlight = formData.get("titleHighlight") as string;
  const description = formData.get("description") as string;
  const buttonText = formData.get("buttonText") as string;
  const buttonUrl = formData.get("buttonUrl") as string;
  const isDraft = formData.get("isDraft") === "true";

  let imageUrl: string | null | undefined = undefined;
  const imageFile = formData.get("imageFile") as File | null;
  const imageUrlInput = formData.get("imageUrl") as string;

  if (imageFile && imageFile.size > 0) {
    imageUrl = await saveUploadedFile(imageFile);
  } else if (imageUrlInput) {
    imageUrl = imageUrlInput;
  }

  const data: any = { badge, title, titleHighlight, description, buttonText, buttonUrl, isDraft };
  if (imageUrl !== undefined) data.imageUrl = imageUrl;

  if (bannerId) {
    await prisma.homepageBanner.update({ where: { id: bannerId }, data });
  } else {
    await prisma.homepageBanner.create({ data });
  }

  revalidatePath("/homepage");
  revalidatePath("/");
}

export async function publishHomepageBanner(bannerId: string) {
  await checkAdminAccess();
  await prisma.homepageBanner.update({
    where: { id: bannerId },
    data: { isDraft: false },
  });
  revalidatePath("/homepage");
  revalidatePath("/");
}
