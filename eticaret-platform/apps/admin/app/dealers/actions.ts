"use server";

import { prisma } from "@eticaret/database";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { checkAdminAccess } from "../../auth";

type PriceListEnum = "LIST_A" | "LIST_B" | "LIST_C" | "LIST_D";

export interface DealerInput {
  name: string;
  email: string;
  password?: string;
  companyName: string;
  taxOffice: string;
  taxNumber: string;
  priceList: string;
  creditLimit: number;
  isApproved: boolean;
}

export async function createDealerAction(data: DealerInput) {
  try {
    await checkAdminAccess();
    if (!data.password) {
      throw new Error("Yeni bayi için şifre zorunludur.");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("Bu e-posta adresi ile zaten bir kayıt mevcut.");
    }

    // Güvenli şifre hashleme (10 round)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    // Tek bir transaction içinde User ve B2BProfile oluşturuluyor
    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash,
          role: "DEALER",
          isActive: true,
          isVerified: data.isApproved,
          b2bProfile: {
            create: {
              companyName: data.companyName,
              taxOffice: data.taxOffice,
              taxNumber: data.taxNumber,
              priceList: data.priceList as PriceListEnum,
              creditLimit: data.creditLimit,
              isApproved: data.isApproved,
            }
          }
        }
      });
    });

    revalidatePath("/dealers");
    return { success: true };
  } catch (error: any) {
    console.error("Bayi oluşturulurken hata:", error);
    return { success: false, error: error.message || "Bayi oluşturulamadı." };
  }
}

export async function updateDealerAction(userId: string, data: DealerInput) {
  try {
    await checkAdminAccess();
    const updateData: any = {
      name: data.name,
      email: data.email,
      isVerified: data.isApproved,
    };

    // Eğer şifre girilmişse, şifreyi de güvenli şekilde güncelle
    if (data.password && data.password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(data.password, salt);
    }

    await prisma.$transaction(async (tx) => {
      // 1. Kullanıcı bilgilerini güncelle
      await tx.user.update({
        where: { id: userId },
        data: updateData,
      });

      // 2. B2B Profilini güncelle
      await tx.b2BProfile.update({
        where: { userId },
        data: {
          companyName: data.companyName,
          taxOffice: data.taxOffice,
          taxNumber: data.taxNumber,
          priceList: data.priceList as PriceListEnum,
          creditLimit: data.creditLimit,
          isApproved: data.isApproved,
        }
      });
    });

    revalidatePath("/dealers");
    return { success: true };
  } catch (error: any) {
    console.error("Bayi güncellenirken hata:", error);
    return { success: false, error: error.message || "Bayi güncellenemedi." };
  }
}
