import NextAuth, { type NextAuthResult } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@eticaret/database"
import bcrypt from "bcryptjs"
import { DefaultSession } from "next-auth"

const nextAuth = NextAuth({
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
          where: { email: (credentials.email as string).toLowerCase() },
        })

        if (!user) {
          return null
        }

        if (!user.isActive) {
          await prisma.userActionRequest.create({
            data: {
              userId: user.id,
              actionType: "ADMIN_LOGIN_ATTEMPT",
              description: `Pasif durumdaki kullanıcı admin paneline giriş yapmaya çalıştı.`,
              status: "PENDING"
            }
          });
          throw new Error("SUSPENDED");
        }

        // Fetch dynamic allowed roles for Admin Panel login
        const allowedRolesSetting = await prisma.systemSetting.findUnique({
          where: { key: "admin_allowed_roles" }
        });
        const allowedRoles = allowedRolesSetting ? allowedRolesSetting.value.split(",") : ["ADMIN"];

        if (!allowedRoles.includes(user.role)) {
           return null;
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

export const handlers = nextAuth.handlers;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;
export const auth: any = nextAuth.auth;

export async function checkAdminAccess() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Erişim Reddedildi: Lütfen giriş yapın.");
  }
  
  const allowedRolesSetting = await prisma.systemSetting.findUnique({
    where: { key: "admin_allowed_roles" }
  });
  const allowedRoles = allowedRolesSetting ? allowedRolesSetting.value.split(",") : ["ADMIN"];

  if (!allowedRoles.includes(session.user.role)) {
    throw new Error("Erişim Reddedildi: Yetkisiz işlem.");
  }

  return session.user;
}
