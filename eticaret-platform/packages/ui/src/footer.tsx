"use client";

import React from "react";
import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  Headphones,
  CreditCard,
  ArrowRight
} from "lucide-react";

// Custom Social Icons since they are missing in the current lucide-react version
const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Facebook = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const Twitter = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

const Youtube = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

interface FooterProps {
  platform: "TYPEC" | "TOPTANBOX";
}

export const Footer = ({ platform }: FooterProps) => {
  const isTypeC = platform === "TYPEC";

  return (
    <footer className="bg-gray-100 font-sans">
      {/* Trust Bar */}
      <div className="border-y border-gray-100 py-24 md:py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: Truck, title: "HIZLI TESLİMAT", desc: "1500 TL Üzeri Ücretsiz Kargo" },
              { icon: ShieldCheck, title: "GÜVENLİ ÖDEME", desc: "256-Bit SSL Koruma" },
              { icon: Headphones, title: "CANLI DESTEK", desc: "7/24 Uzman Ekip Desteği" },
              { icon: CreditCard, title: "TAKSİT İMKANI", desc: "Tüm Kartlara 12 Taksit" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 group">
                <div className={`w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-[#1A1A1A] transition-all duration-300 group-hover:text-white ${isTypeC ? "group-hover:bg-[#E31E24]" : "group-hover:bg-orange-500"
                  }`}>
                  <item.icon className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-[12px] font-bold tracking-widest text-[#1A1A1A]" style={{ fontFamily: 'var(--font-heading)' }}>{item.title}</h4>
                  <p className="text-[11px] text-gray-400 font-medium mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-24 max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 md:gap-24">

          {/* Brand & Newsletter */}
          <div className="lg:col-span-4 space-y-10">
            <Link href="/" className="inline-block">
              <span className={`text-3xl font-black tracking-tighter ${isTypeC ? "text-[#E31E24]" : "text-orange-500"}`} style={{ fontFamily: 'var(--font-heading)' }}>
                {isTypeC ? "Type-C" : "ToptanBOX"}
              </span>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-sm font-medium">
              Geleceğin teknolojisini, minimalist tasarım ve maksimum performansla birleştiriyoruz. Yaşam tarzınızı teknolojiyle şekillendirin.
            </p>

            <div className="space-y-4 pt-4">
              <h5 className="text-[11px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase">Bültene Katılın</h5>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="flex-1 bg-gray-50 border-none rounded-full py-3.5 px-6 text-xs font-bold outline-none ring-1 ring-transparent focus:ring-[#1A1A1A] transition-all"
                />
                <button className={`w-12 h-12 text-white rounded-full flex items-center justify-center transition-all duration-300 ${isTypeC ? "bg-[#1A1A1A] hover:bg-[#E31E24]" : "bg-slate-900 hover:bg-orange-500"
                  }`}>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2">
            <h5 className="text-[11px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase mb-10" style={{ fontFamily: 'var(--font-heading)' }}>Kurumsal</h5>
            <ul className="space-y-4">
              {[
                { name: "Hakkımızda", href: "#" },
                { name: "Kariyer", href: "#" },
                { name: "Sürdürülebilirlik", href: "#" },
                { name: "Mağazalarımız", href: "#" },
                { name: "İletişim", href: isTypeC ? "/contact" : "#" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-[#E31E24] transition-colors font-medium">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h5 className="text-[11px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase mb-10" style={{ fontFamily: 'var(--font-heading)' }}>Yardım</h5>
            <ul className="space-y-4">
              {["Sıkça Sorulan Sorular", "Kargo Takip", "İade Koşulları", "Garanti Şartları", "Kullanım Şartları"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-sm text-gray-400 hover:text-[#E31E24] transition-colors font-medium">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h5 className="text-[11px] font-bold tracking-[0.2em] text-[#1A1A1A] uppercase mb-10" style={{ fontFamily: 'var(--font-heading)' }}>Bizi Takip Edin</h5>
            <div className="flex flex-wrap gap-4 mb-10">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all duration-300"
                >
                  <Icon className="w-5 h-5 stroke-[1.5]" />
                </Link>
              ))}
            </div>
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100">
              <p className="text-[11px] font-bold text-[#1A1A1A] mb-2 uppercase tracking-widest">Müşteri Hizmetleri</p>
              <Link href="tel:08501234567" className={`text-xl font-black text-[#1A1A1A] transition-colors ${isTypeC ? "hover:text-[#E31E24]" : "hover:text-orange-500"
                }`}>0850 123 45 67</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-50 py-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              © 2026 {platform} • TÜM HAKLARI SAKLIDIR.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-[10px] font-bold text-gray-400 hover:text-[#1A1A1A] transition-colors uppercase tracking-widest">KVKK</Link>
              <Link href="#" className="text-[10px] font-bold text-gray-400 hover:text-[#1A1A1A] transition-colors uppercase tracking-widest">Çerez Politikası</Link>
            </div>
          </div>

          <div className="flex items-center gap-8 grayscale opacity-30 hover:opacity-100 hover:grayscale-0 transition-all duration-700">
            <img src="https://cdn.paytr.com/logos/visa.svg" alt="Visa" className="h-4" />
            <img src="https://cdn.paytr.com/logos/mastercard.svg" alt="Mastercard" className="h-4" />
            <img src="https://cdn.paytr.com/logos/troy.svg" alt="Troy" className="h-5" />
            <div className="text-[10px] font-black tracking-widest text-[#1A1A1A]">IYZICO</div>
          </div>
        </div>
      </div>
    </footer>
  );
};
