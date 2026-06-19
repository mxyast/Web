"use server";

import { prisma } from "@eticaret/database";
import { revalidatePath } from "next/cache";
import { checkAdminAccess } from "../../auth";

export async function getAllowedRoles(): Promise<string[]> {
  await checkAdminAccess();
  const setting = await prisma.systemSetting.findUnique({
    where: { key: "admin_allowed_roles" }
  });
  return setting ? setting.value.split(",") : ["ADMIN"];
}

export async function updateAllowedRoles(roles: string[]) {
  await checkAdminAccess();
  if (!roles || roles.length === 0) {
    throw new Error("En az bir rol seçilmelidir.");
  }

  await prisma.systemSetting.upsert({
    where: { key: "admin_allowed_roles" },
    update: { value: roles.join(",") },
    create: { key: "admin_allowed_roles", value: roles.join(",") }
  });

  revalidatePath("/settings");
}
