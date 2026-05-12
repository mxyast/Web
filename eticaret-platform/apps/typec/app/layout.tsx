import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { auth } from "../auth";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  variable: "--font-montserrat",
  weight: ["700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TypeC - Premium Technology Store",
  description: "New generation technology accessories and smart living solutions.",
};

import { TypeCNavbar } from "@repo/ui/typec-navbar";
import { Footer } from "@repo/ui/footer";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="tr" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="antialiased min-h-screen font-sans bg-white text-[#1A1A1A]">
        <div className="flex flex-col min-h-screen">
          <TypeCNavbar user={session?.user ? { name: session.user.name!, role: session.user.role! } : null} />
          <main className="flex-1">
            {children}
          </main>
          <Footer platform="TYPEC" />
        </div>
      </body>
    </html>
  );
}
