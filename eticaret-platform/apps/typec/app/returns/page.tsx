import React from "react";
import { ArrowLeftRight, ShieldCheck, HelpCircle } from "lucide-react";

export default function ReturnsPage() {
  return (
    <>
      <main className="flex-1 py-12 md:py-20 pt-32 animate-fade-in">
        <div className="container mx-auto px-4 max-w-3xl space-y-16">
          
          <div className="text-center max-w-xl mx-auto space-y-6">
            <span className="text-[#E31E24] font-bold text-[10px] tracking-[0.4em] uppercase">DEĞİŞİM & GARANTİ</span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-black leading-none">
              İADE VE GARANTİ ŞARTLARI
            </h1>
            <p className="text-gray-400 font-medium text-sm leading-relaxed">
              Müşteri memnuniyetini ön planda tutan iade sürecimiz ve distribütör garantili ürün güvencemiz hakkında detaylar.
            </p>
          </div>

          {/* Return Policy Section */}
          <section className="bg-[#FBFBFB] border border-gray-100 rounded-[2.5rem] p-8 md:p-12 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-[#E31E24] flex items-center justify-center shadow-sm">
                <ArrowLeftRight className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">14 Gün Kolay İade Koşulları</h2>
            </div>
            <p className="text-xs md:text-sm font-semibold text-gray-500 leading-relaxed">
              TypeC'den satın aldığınız tüm ürünleri, kargo teslim tarihinden itibaren **14 gün** içerisinde hiçbir gerekçe göstermeksizin iade edebilir veya değiştirebilirsiniz.
            </p>
            <div className="border-t border-gray-200/50 pt-6 space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">İade Şartları:</h3>
              <ul className="list-disc pl-5 text-xs text-gray-400 font-semibold space-y-2">
                <li>İade edilecek ürünün orijinal kutusu, ambalajı ve jelatinleri zarar görmemiş olmalıdır.</li>
                <li>Ürün ile birlikte gönderilen tüm aksesuarlar, hediyeler ve ek parçalar eksiksiz olarak kutuya konulmalıdır.</li>
                <li>Hijyenik sebeplerden dolayı kulak içi kulaklıkların koruma bandı açıldıktan sonra iadesi kabul edilmemektedir (kusurlu ürünler hariç).</li>
                <li>İadelerinizi sitemizden aldığınız ücretsiz kargo gönderim kodu ile Yurtiçi Kargo üzerinden gönderebilirsiniz.</li>
              </ul>
            </div>
          </section>

          {/* Warranty Section */}
          <section id="warranty" className="bg-[#FBFBFB] border border-gray-100 rounded-[2.5rem] p-8 md:p-12 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-green-600 flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">2 Yıl Distribütör Garantisi</h2>
            </div>
            <p className="text-xs md:text-sm font-semibold text-gray-500 leading-relaxed">
              Sitemizden aldığınız tüm ürünler Türkiye distribütörü güvencesiyle **24 ay (2 yıl)** resmi garanti kapsamındadır.
            </p>
            <div className="border-t border-gray-200/50 pt-6 space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">Garanti ve Teknik Servis Süreci:</h3>
              <ul className="list-disc pl-5 text-xs text-gray-400 font-semibold space-y-2">
                <li>Arıza durumunda faturanız veya ürün kutusundan çıkan garanti belgesi ile yetkili teknik servise başvurabilirsiniz.</li>
                <li>Kullanıcı kaynaklı sıvı teması, darbe, kırılma ve aşırı voltaj gibi durumlar garanti kapsamı dışındadır.</li>
                <li>Teknik servis süresi yasal olarak maksimum 20 iş günüdür. Genellikle ilk 7 iş günü içinde çözüme kavuşturulmaktadır.</li>
              </ul>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
