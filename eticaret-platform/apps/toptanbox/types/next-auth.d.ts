import { DefaultSession } from "next-auth"

// Define roles locally to decouple from Prisma in the frontend
export type UserRole = "ADMIN" | "DEALER" | "USER"

declare module "next-auth" {
  interface User {
    id: string
    role?: UserRole
  }
  interface Session {
    user: {
      id: string
      role?: UserRole
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role?: UserRole
  }
}
