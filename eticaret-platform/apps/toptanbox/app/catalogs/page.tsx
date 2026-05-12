import { prisma } from "@eticaret/database";
import { Box, Sparkles, FileText } from "lucide-react";
import { Button } from "@repo/ui/button";
import CatalogList from "./CatalogList";

export default async function CatalogsPage() {
  const templates = await prisma.catalogTemplate.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-36 md:pt-40 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-slate-950">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--color-toptan-orange)_0%,_transparent_70%)]" />
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-[var(--color-toptan-orange)]" />
              <span className="text-[10px] font-bold text-[var(--color-toptan-orange)] uppercase tracking-wider">Katalog Motoru v2.0</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              Kendi Kataloğunuzu <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-toptan-orange)] to-orange-300">Saniyeler İçinde</span> Oluşturun.
            </h1>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl leading-relaxed">
              İstediğiniz markaları, kategorileri veya spesifik ürünleri seçin. Logonuzu ekleyin, fiyatlı veya fiyatsız PDF kataloğunuzu anında indirin.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="px-10 rounded-2xl">Hemen Başla</Button>
              <Button variant="outline" size="lg" className="px-10 rounded-2xl border-white/10 text-white hover:bg-white/5">Nasıl Çalışır?</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-[var(--color-toptan-bg)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Steps / Info */}
            <div className="lg:col-span-1 space-y-8">
              <div className="sticky top-32">
                <h2 className="text-2xl font-black mb-8 text-slate-900">3 Adımda Profesyonel Katalog</h2>
                <div className="space-y-6">
                  {[
                    { title: "Ürünleri Seçin", desc: "Şablona uygun olarak ürünler otomatik çekilir veya manuel filtreleme yapılır.", icon: <Box className="w-5 h-5" /> },
                    { title: "Fiyat Listenizi Uygulayın", desc: "Bayi indirim oranlarınıza (Liste A, Liste B vb.) göre fiyatlar hesaplanır.", icon: <Sparkles className="w-5 h-5" /> },
                    { title: "PDF Olarak İndirin", desc: "Müşterilerinize özel hazırladığınız kataloğu anında paylaşın.", icon: <FileText className="w-5 h-5" /> }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4 p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
                      <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 text-slate-400">
                        {step.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">{step.title}</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <CatalogList templates={templates} />
          </div>
        </div>
      </section>
    </>
  );
}
