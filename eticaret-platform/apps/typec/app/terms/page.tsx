import React from "react";
import { FileText, Award, Gavel } from "lucide-react";

export default function TermsPage() {
  return (
    <>
      <main className="flex-1 py-12 md:py-20 pt-32 animate-fade-in">
        <div className="container mx-auto px-4 max-w-3xl space-y-16">
          
          <div className="text-center max-w-xl mx-auto space-y-6">
            <span className="text-[#E31E24] font-bold text-[10px] tracking-[0.4em] uppercase">YASAL PROSEDÜRLER</span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-black leading-none">
              KULLANIM ŞARTLARI
            </h1>
            <p className="text-gray-400 font-medium text-sm leading-relaxed">
              Sitemizi ziyaret ederek veya alışveriş yaparak kabul etmiş sayılacağınız genel kullanım şartları ve kurallarımız.
            </p>
          </div>

          {/* Terms Section */}
          <section className="bg-[#FBFBFB] border border-gray-100 rounded-[2.5rem] p-8 md:p-12 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-[#E31E24] flex items-center justify-center shadow-sm">
                <Gavel className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Kullanım Koşulları ve Sözleşmesi</h2>
            </div>
            <p className="text-xs font-semibold text-gray-500 leading-relaxed">
              Bu web sitesini kullanmanız veya sitemiz üzerinden sipariş vermeniz durumunda aşağıda yer alan şartları peşinen kabul etmiş olursunuz.
            </p>
            <div className="border-t border-gray-200/50 pt-6 space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">1. Telif Hakları ve Mülkiyet</h3>
              <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                Bu web sitesinde bulunan marka logoları, metinler, görseller ve kodlar TypeC'ye veya ilgili marka sahiplerine aittir. İzinsiz kopyalanması, kullanılması veya dağıtılması yasaktır.
              </p>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">2. Fiyatlandırma ve Stok Hataları</h3>
              <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                Ürün fiyatlarında ve stok adetlerinde sistemsel hatalardan kaynaklanan yanlışlıklar durumunda, TypeC siparişi iptal etme ve ücreti müşteriye iade etme hakkını saklı tutar.
              </p>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">3. Yaş ve Sorumluluk Sınırı</h3>
              <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                Web sitemiz üzerinden yapılan alışverişlerde kredi kartı kullanan kişilerin 18 yaşından büyük olması ve kart sahibiyle yasal ilişkiye sahip olması gerekmektedir.
              </p>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
