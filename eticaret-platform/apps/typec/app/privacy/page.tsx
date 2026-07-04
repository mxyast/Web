import React from "react";
import { ShieldCheck, Eye, Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <>
      <main className="flex-1 py-12 md:py-20 pt-32 animate-fade-in">
        <div className="container mx-auto px-4 max-w-3xl space-y-16">
          
          <div className="text-center max-w-xl mx-auto space-y-6">
            <span className="text-[#E31E24] font-bold text-[10px] tracking-[0.4em] uppercase">YASAL PROSEDÜRLER</span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-black leading-none">
              GİZLİLİK VE KVKK POLİTİKASI
            </h1>
            <p className="text-gray-400 font-medium text-sm leading-relaxed">
              Kişisel verilerinizin güvenliği ve gizliliğiniz bizim için en üst düzeyde önem taşır. Yasal süreçlerimiz ve haklarınız.
            </p>
          </div>

          {/* KVKK Section */}
          <section className="bg-[#FBFBFB] border border-gray-100 rounded-[2.5rem] p-8 md:p-12 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-[#E31E24] flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">KVKK Aydınlatma Metni</h2>
            </div>
            <p className="text-xs font-semibold text-gray-500 leading-relaxed">
              6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, veri sorumlusu sıfatıyla TypeC olarak kişisel verilerinizi topluyor, işliyor ve koruyoruz.
            </p>
            <div className="border-t border-gray-200/50 pt-6 space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">Verilerinizin İşlenme Amaçları:</h3>
              <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                Kişisel verileriniz; faturalandırma işlemlerinin yapılması, siparişinizin kargo ile ulaştırılması, müşteri hizmetleri desteği sağlanması ve yasal bildirimlerin yerine getirilmesi amacıyla işlenmektedir.
              </p>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">Veri Sahibi Olarak Haklarınız:</h3>
              <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                KVKK 11. Maddesi kapsamında verilerinizin işlenip işlenmediğini öğrenme, yanlış işlenmişse düzeltilmesini talep etme ve silinmesini isteme hakkına sahipsiniz. Başvurularınızı destek e-posta adresimiz üzerinden gerçekleştirebilirsiniz.
              </p>
            </div>
          </section>

          {/* Cookies Policy Section */}
          <section id="cookies" className="bg-[#FBFBFB] border border-gray-100 rounded-[2.5rem] p-8 md:p-12 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-blue-600 flex items-center justify-center shadow-sm">
                <Eye className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Çerez Politikası (Cookie Policy)</h2>
            </div>
            <p className="text-xs font-semibold text-gray-500 leading-relaxed">
              Web sitemizin performansını artırmak ve sizlere daha iyi bir kullanıcı deneyimi sunabilmek için çerezler kullanmaktayız.
            </p>
            <div className="border-t border-gray-200/50 pt-6 space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">Kullandığımız Çerez Tipleri:</h3>
              <ul className="list-disc pl-5 text-xs text-gray-400 font-semibold space-y-2">
                <li>**Zorunlu Çerezler:** Üye girişi ve sepet fonksiyonlarının çalışması için zorunludur.</li>
                <li>**Analitik Çerezler:** Sitemizdeki ziyaretçi davranışlarını analiz ederek arayüzümüzü iyileştirmemize yarar.</li>
                <li>**Tercih Çerezleri:** Dil tercihi gibi ayarlarınızı hatırlamak amacıyla kullanılır.</li>
              </ul>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
