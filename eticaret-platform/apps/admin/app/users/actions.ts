"use server";

import { prisma } from "@eticaret/database";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { checkAdminAccess } from "../../auth";

export async function createUser(formData: FormData) {
  await checkAdminAccess();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!name || !email || !password || !role) {
    throw new Error("Tüm alanlar gereklidir.");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw new Error("Bu e-posta adresiyle kayıtlı bir kullanıcı zaten mevcut.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      isActive: true,
      isVerified: true,
    },
  });

  revalidatePath("/users");
}

export async function updateUserRole(userId: string, role: string) {
  await checkAdminAccess();
  if (!userId || !role) {
    throw new Error("Geçersiz parametreler.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/users");
}

export async function toggleUserStatus(userId: string, currentStatus: boolean) {
  await checkAdminAccess();
  if (!userId) {
    throw new Error("Kullanıcı ID gereklidir.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: !currentStatus },
  });

  revalidatePath("/users");
}

export async function deleteUser(userId: string) {
  await checkAdminAccess();
  if (!userId) {
    throw new Error("Kullanıcı ID gereklidir.");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/users");
}

export async function approveActionRequest(requestId: string) {
  await checkAdminAccess();
  if (!requestId) {
    throw new Error("Talep ID gereklidir.");
  }

  const request = await prisma.userActionRequest.findUnique({
    where: { id: requestId }
  });

  if (!request) {
    throw new Error("Talep bulunamadı.");
  }

  // 1. Approve request
  await prisma.userActionRequest.update({
    where: { id: requestId },
    data: { status: "APPROVED" }
  });

  // 2. Reactivate user
  await prisma.user.update({
    where: { id: request.userId },
    data: { isActive: true }
  });

  revalidatePath("/users");
}

export async function rejectActionRequest(requestId: string) {
  await checkAdminAccess();
  if (!requestId) {
    throw new Error("Talep ID gereklidir.");
  }

  await prisma.userActionRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED" }
  });

  revalidatePath("/users");
}

