"use server";

import { prisma } from "@eticaret/database";
import { revalidatePath } from "next/cache";
import { checkAdminAccess } from "../../auth";
import { logAdminAction } from "../utils/audit";

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

  await logAdminAction(
    "UPDATE_SETTINGS",
    "SystemSetting",
    "admin_allowed_roles",
    `Yönetici giriş yetkileri güncellendi. İzin verilen roller: ${roles.join(", ")}`
  );

  revalidatePath("/settings");
}
