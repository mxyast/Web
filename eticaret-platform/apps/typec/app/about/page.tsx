import React from "react";
import { ArrowRight, Sparkles, Target, Users, MapPin, Heart } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <main className="flex-1 py-12 md:py-20 pt-32">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-24">
          
          {/* Hero Section */}
          <section className="text-center max-w-3xl mx-auto space-y-6">
            <span className="text-[#E31E24] font-bold text-[10px] tracking-[0.4em] uppercase">BİZ KİMİZ?</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-black leading-none">
              GELECEĞİN TEKNOLOJİSİNİ <br /> BUGÜNE TAŞIYORUZ.
            </h1>
            <p className="text-gray-400 font-medium text-lg leading-relaxed">
              TypeC olarak, minimalist tasarımı üstün mühendislikle buluşturan yeni nesil mobil aksesuarlar ve akıllı yaşam çözümleri sunuyoruz.
            </p>
          </section>

          {/* About Corporate */}
          <section id="about" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-[#FBFBFB] p-8 md:p-16 rounded-[3rem] border border-gray-100">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#E31E24] shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">Vizyonumuz & Misyonumuz</h2>
              <p className="text-sm font-medium text-gray-500 leading-relaxed">
                Şarj teknolojilerinin hızla değiştiği dünyamızda, Baseus başta olmak üzere en iyi global markaların distribütörlüğünü yaparak tüketicilerimize en hızlı, en güvenli ve en şık şarj deneyimini sunmayı hedefliyoruz.
              </p>
              <p className="text-sm font-medium text-gray-500 leading-relaxed">
                Cihazlarınızı koruyan akıllı yongalar (chips), yüksek kaliteli GaN teknolojileri ve sürdürülebilir malzeme kullanımı ile sadece bugünü değil, yarını da inşa ediyoruz.
              </p>
            </div>
            <div className="aspect-[4/3] rounded-[2rem] overflow-hidden border border-gray-100 shadow-inner">
              <img 
                src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800" 
                alt="Teknoloji Ürünleri" 
                className="w-full h-full object-cover" 
              />
            </div>
          </section>

          {/* Careers & Sustainability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section id="careers" className="p-8 md:p-12 rounded-[2.5rem] border border-gray-100 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-slate-800 border border-gray-100">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Kariyer Fırsatları</h3>
              <p className="text-xs font-semibold text-gray-400 leading-relaxed">
                Teknoloji tutkusunu profesyonel hayatına yansıtmak isteyen takım arkadaşlarını arıyoruz. Dinamik ve yenilikçi çalışma ortamımızda senin için de bir yer olabilir.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E31E24] hover:gap-3 transition-all">
                Açık Pozisyonlar <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </section>

            <section id="sustainability" className="p-8 md:p-12 rounded-[2.5rem] border border-gray-100 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-slate-800 border border-gray-100">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Sürdürülebilirlik Taahhüdümüz</h3>
              <p className="text-xs font-semibold text-gray-400 leading-relaxed">
                Gezegenimizin geleceğini önemsiyoruz. Ambalajlarımızda %100 geri dönüştürülebilir malzemeler kullanıyor ve karbon ayak izimizi azaltacak lojistik çözümler üretiyoruz.
              </p>
              <Link href="/products" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E31E24] hover:gap-3 transition-all">
                Ürünleri İncele <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </section>
          </div>

          {/* Our Stores */}
          <section id="stores" className="space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-slate-800 mx-auto border border-gray-100">
                <MapPin className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">Deneyim Mağazalarımız</h2>
              <p className="text-xs font-semibold text-gray-400 leading-relaxed">
                Ürünlerimizi yakından incelemek, uzman ekibimizden destek almak ve en yeni şarj teknolojilerini yerinde deneyimlemek için mağazalarımıza davetlisiniz.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#FBFBFB] rounded-3xl p-8 border border-gray-100 space-y-4">
                <h4 className="font-bold text-sm">İstanbul Zorlu Center Mağazası</h4>
                <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                  Zorlu Center AVM, Kat: -1 No: 45 <br />
                  Beşiktaş / İstanbul
                </p>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Hafta İçi & Hafta Sonu: 10:00 - 22:00
                </div>
              </div>
              <div className="bg-[#FBFBFB] rounded-3xl p-8 border border-gray-100 space-y-4">
                <h4 className="font-bold text-sm">İzmir İstinyePark Mağazası</h4>
                <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                  İstinyePark AVM, Kat: Zemin No: 12 <br />
                  Balçova / İzmir
                </p>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Hafta İçi & Hafta Sonu: 10:00 - 22:00
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
