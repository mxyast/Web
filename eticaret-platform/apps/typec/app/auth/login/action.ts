"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Geçersiz e-posta veya şifre." }
        default:
          return { error: "Bir hata oluştu." }
      }
    }
    // Next.js redirect errors need to be thrown to work properly
    throw error 
  }
}
