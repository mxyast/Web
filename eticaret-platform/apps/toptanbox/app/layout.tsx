import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth } from "../auth";
import { ToptanBoxNavbar } from "@repo/ui/toptanbox-navbar";
import { Footer } from "@repo/ui/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ToptanBox - Kurumsal B2B Portal",
  description: "Toptan elektronik ürün tedariği, koli bazlı alım, cari hesap yönetimi ve bayiye özel kataloglar.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="tr" className={inter.variable}>
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 font-sans">
        <div className="flex flex-col min-h-screen">
          <ToptanBoxNavbar
            user={session?.user ? { name: session.user.name!, role: session.user.role! } : null}
          />
          <main className="flex-1">
            {children}
          </main>
          <Footer platform="TOPTANBOX" />
        </div>
      </body>
    </html>
  );
}
