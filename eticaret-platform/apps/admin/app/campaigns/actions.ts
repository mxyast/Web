"use server";

import { prisma } from "@eticaret/database";
import { revalidatePath } from "next/cache";
import { checkAdminAccess } from "../../auth";

export async function createCampaign(data: {
  title: string;
  description?: string;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  platform: "TYPEC" | "TOPTANBOX";
  productIds: string[];
}) {
  await checkAdminAccess();
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
  
  await prisma.campaign.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      imageUrl: data.imageUrl,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      isActive: data.isActive,
      platform: data.platform,
      products: {
        connect: data.productIds.map(id => ({ id }))
      }
    }
  });

  revalidatePath("/campaigns");
  return { success: true };
}

export async function updateCampaign(id: string, data: {
  title: string;
  description?: string;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  platform: "TYPEC" | "TOPTANBOX";
  productIds: string[];
}) {
  await checkAdminAccess();
  await prisma.campaign.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      isActive: data.isActive,
      platform: data.platform,
      products: {
        set: data.productIds.map(pid => ({ id: pid }))
      }
    }
  });

  revalidatePath("/campaigns");
  revalidatePath(`/campaigns/${id}`);
  return { success: true };
}

export async function deleteCampaign(id: string) {
  await checkAdminAccess();
  await prisma.campaign.delete({
    where: { id }
  });

  revalidatePath("/campaigns");
  return { success: true };
}
