import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "../components/Sidebar";
import { headers } from "next/headers";
import { auth } from "../auth";
import { prisma } from "@eticaret/database";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Admin Panel | ToptanBox & TypeC",
  description: "Merkezi Yönetim Paneli",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";
  const isLoginPage = pathname.startsWith("/auth/login");

  if (isLoginPage) {
    return (
      <html lang="tr" className={inter.variable}>
        <body className="antialiased min-h-screen bg-slate-950 text-white font-sans">
          {children}
        </body>
      </html>
    );
  }

  // Enforce session check on Node.js runtime
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/login");
  }

  // Dynamic database-backed Allowed Roles check
  const allowedRolesSetting = await prisma.systemSetting.findUnique({
    where: { key: "admin_allowed_roles" }
  });
  const allowedRoles = allowedRolesSetting ? allowedRolesSetting.value.split(",") : ["ADMIN"];

  if (!allowedRoles.includes(session.user.role)) {
    redirect("/auth/login?error=AccessDenied");
  }

  return (
    <html lang="tr" className={inter.variable}>
      <body className="antialiased min-h-screen bg-[var(--color-admin-bg)] text-[var(--color-admin-text)] font-sans">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}

