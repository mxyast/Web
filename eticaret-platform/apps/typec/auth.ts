import NextAuth, { type NextAuthResult } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@eticaret/database"
import bcrypt from "bcryptjs"
import { DefaultSession } from "next-auth"

const nextAuth = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.isActive) {
          return null
        }

        // Only allow customers to login to TypeC (B2C) by default
        // Admins can login everywhere
        if (user.role !== "CUSTOMER" && user.role !== "ADMIN") {
           return null
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isValidPassword) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as any
        session.user.id = token.id as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
})

export const handlers = nextAuth.handlers
export const signIn = nextAuth.signIn
export const signOut = nextAuth.signOut
export const auth: any = nextAuth.auth
