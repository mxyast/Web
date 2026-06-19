"use server"

import { prisma } from "@eticaret/database"
import bcrypt from "bcryptjs"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { headers } from "next/headers"

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string
  const email = (formData.get("email") as string).toLowerCase()
  const password = formData.get("password") as string
  
  // 1. Honeypot Check (Bot Tuzağı)
  const honeypot = formData.get("website") as string
  if (honeypot) {
    // If the hidden field is filled, it's likely a bot.
    return { error: "Kayıt işlemi başarısız. Lütfen tekrar deneyin." }
  }

  if (!name || !email || !password) {
    return { error: "Lütfen tüm alanları doldurun." }
  }

  if (password.length < 6) {
    return { error: "Şifre en az 6 karakter olmalıdır." }
  }

  try {
    // 2. Rate Limiting Check (IP tabanlı)
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for")
    const realIp = headersList.get("x-real-ip")
    // Fallback to "unknown" if IP is missing (e.g. local dev without proxy)
    const ip = (forwardedFor ? forwardedFor.split(",")[0] : realIp) || "unknown"
    
    // Yalnızca anlamlı IP'leri rate-limit'e tabi tut (unknown veya ::1 değilse)
    if (ip !== "unknown" && ip !== "::1" && ip !== "127.0.0.1") {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      
      const attemptsCount = await prisma.rateLimit.count({
        where: {
          ip,
          action: "REGISTER",
          timestamp: { gte: oneHourAgo }
        }
      })

      if (attemptsCount >= 3) {
        return { error: "Çok fazla kayıt denemesi yaptınız. Lütfen daha sonra tekrar deneyin." }
      }

      // Record this attempt
      await prisma.rateLimit.create({
        data: {
          ip,
          action: "REGISTER"
        }
      })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "Bu e-posta adresi zaten kullanılıyor." }
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Create user in DB
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "CUSTOMER", // B2C users are CUSTOMER by default
        isActive: true,
      },
    })

    // After creation, automatically sign in the user
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/", // Redirect to home page after success
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Kayıt başarılı ancak otomatik giriş yapılırken bir sorun oluştu." }
    }
    // NEXT_REDIRECT error is thrown by next-auth on success to redirect the user
    throw error
  }
}
