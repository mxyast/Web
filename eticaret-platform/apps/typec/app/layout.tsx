import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { auth } from "../auth";
import { prisma } from "@eticaret/database";

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
  metadataBase: new URL("https://typec.com.tr"),
  title: {
    template: "%s | TypeC",
    default: "TypeC - Premium Technology Store",
  },
  description: "Yeni nesil teknoloji aksesuarları, premium şarj aletleri ve akıllı yaşam çözümleri.",
  alternates: {
    canonical: "https://typec.com.tr",
    languages: {
      "tr-TR": "https://typec.com.tr",
    },
  },
  openGraph: {
    title: "TypeC - Premium Technology Store",
    description: "Yeni nesil teknoloji aksesuarları, premium şarj aletleri ve akıllı yaşam çözümleri.",
    url: "https://typec.com.tr",
    siteName: "TypeC",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TypeC - Premium Technology Store",
    description: "Yeni nesil teknoloji aksesuarları.",
  },
};

import { ClientNavbarWrapper } from "@/components/ClientNavbarWrapper";
import { Footer } from "@repo/ui/footer";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, name: true, slug: true }
  });

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TypeC",
    url: "https://typec.com.tr",
    logo: "https://typec.com.tr/logo.png",
    sameAs: [
      "https://instagram.com/typec.com.tr",
    ],
  };

  return (
    <html lang="tr" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="antialiased min-h-screen font-sans bg-white text-[#1A1A1A]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <div className="flex flex-col min-h-screen">
          <ClientNavbarWrapper 
            user={session?.user ? { name: session.user.name!, role: session.user.role! } : null} 
            categories={categories}
          />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer platform="TYPEC" />
        </div>
      </body>
    </html>
  );
}
