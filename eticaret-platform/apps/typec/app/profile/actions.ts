"use server"

import { auth } from "../../auth"
import { prisma } from "@eticaret/database"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

export async function updateProfileAction(formData: FormData) {
  const session = await auth()

  if (!session?.user?.email) {
    return { error: "Oturum açmanız gerekiyor." }
  }

  const email = session.user.email
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const password = formData.get("password") as string
  const passwordConfirm = formData.get("passwordConfirm") as string

  if (!name) {
    return { error: "Ad Soyad alanı boş bırakılamaz." }
  }

  const updateData: any = {
    name,
    phone: phone || null,
  }

  if (password) {
    if (password.length < 6) {
      return { error: "Şifre en az 6 karakter olmalıdır." }
    }
    if (password !== passwordConfirm) {
      return { error: "Şifreler uyuşmuyor." }
    }

    const salt = await bcrypt.genSalt(10)
    updateData.passwordHash = await bcrypt.hash(password, salt)
  }

  try {
    await prisma.user.update({
      where: { email },
      data: updateData,
    })
  } catch (error) {
    console.error("Profil güncelleme hatası:", error)
    return { error: "Profil güncellenirken bir hata oluştu." }
  }

  try {
    revalidatePath("/profile")
  } catch (error) {
    console.warn("Revalidation warning ignored:", error)
  }

  return { success: "Profil bilgileri başarıyla güncellendi." }
}
