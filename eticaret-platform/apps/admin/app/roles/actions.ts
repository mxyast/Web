"use server";

import { prisma } from "@eticaret/database";
import { revalidatePath } from "next/cache";
import { checkAdminAccess } from "../../auth";

export async function createRole(name: string, description: string, permissions: string[]) {
  await checkAdminAccess();
  const normalizedName = name.trim().toUpperCase();
  
  if (!normalizedName) {
    throw new Error("Rol adı zorunludur.");
  }

  const existingRole = await prisma.roleDefinition.findUnique({
    where: { name: normalizedName }
  });

  if (existingRole) {
    throw new Error("Bu rol zaten tanımlanmış.");
  }

  await prisma.roleDefinition.create({
    data: {
      name: normalizedName,
      description,
      permissions
    }
  });

  revalidatePath("/roles");
  revalidatePath("/users");
}

export async function updateRole(name: string, description: string, permissions: string[]) {
  await checkAdminAccess();
  if (!name) {
    throw new Error("Rol adı zorunludur.");
  }

  await prisma.roleDefinition.update({
    where: { name },
    data: {
      description,
      permissions
    }
  });

  revalidatePath("/roles");
  revalidatePath("/users");
}

export async function deleteRole(name: string) {
  await checkAdminAccess();
  if (!name) {
    throw new Error("Rol adı zorunludur.");
  }

  if (["ADMIN", "CUSTOMER", "DEALER"].includes(name)) {
    throw new Error("Sistem rollerini (ADMIN, CUSTOMER, DEALER) silemezsiniz.");
  }

  await prisma.roleDefinition.delete({
    where: { name }
  });

  revalidatePath("/roles");
  revalidatePath("/users");
}
