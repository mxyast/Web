"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SearchBar } from "./search-bar";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  User,
  Heart,
  Menu,
  X,
  Search,
  ChevronRight,
  Home,
  Grid,
  Tag
} from "lucide-react";
import { usePathname } from "next/navigation";

interface NavbarProps {
  platform: "TYPEC" | "TOPTANBOX";
  user?: {
    name: string;
    role: string;
  } | null;
}

export const Navbar = ({ platform, user }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const pathname = usePathname();
  const isTypeC = platform === "TYPEC";

  const announcements = [
    "1500 TL ÜZERİ ALIŞVERİŞLERDE ÜCRETSİZ KARGO",
    "İLK ALIŞVERİŞE ÖZEL %10 İNDİRİM: typec10",
    "AYNI GÜN HIZLI TESLİMAT SEÇENEĞİ"
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const interval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { name: "Yeni Gelenler", href: "/products?sort=new" },
    { name: "Çok Satanlar", href: "/products?sort=popular" },
    { name: "Koleksiyonlar", href: "/categories" },
    { name: "Kampanyalar", href: "/deals" },
    { name: "Hakkımızda", href: "/about" },
  ];

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-[100] font-sans">
      {/* Announcement Bar */}
      <div className="bg-[#1A1A1A] text-white py-2 text-[10px] font-bold tracking-[0.15em] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 h-6 flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            <motion.p
              key={announcementIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="absolute text-center uppercase"
            >
              {announcements[announcementIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`w-full transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-gray-100 ${isScrolled ? "h-16" : "h-20"}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 h-full flex items-center justify-between">

          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tighter text-[#E31E24] leading-none transition-transform group-hover:scale-105" style={{ fontFamily: 'var(--font-heading)' }}>
              {isTypeC ? "TYPEC" : "TOPTANBOX"}
            </span>
            {isTypeC && <div className="w-1.5 h-1.5 rounded-full bg-[#E31E24] mt-2 animate-pulse" />}
          </Link>

          {/* Center: Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-5 py-2 text-[12px] font-bold tracking-tight rounded-full transition-all duration-300 ${isActive ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A] hover:bg-gray-50"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 md:gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 text-[#1A1A1A] hover:bg-gray-50 rounded-full transition-all"
            >
              <Search className="w-5 h-5 stroke-[2.5]" />
            </button>

            <Link href={user ? "/profile" : "/auth/login"} className="hidden sm:block p-2.5 text-[#1A1A1A] hover:bg-gray-50 rounded-full transition-all">
              <User className="w-5 h-5 stroke-[2.5]" />
            </Link>

            <Link href="/cart" className="p-2.5 text-[#1A1A1A] hover:bg-gray-50 rounded-full transition-all relative">
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#E31E24] text-[8px] text-white flex items-center justify-center rounded-full font-black">2</span>
            </Link>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2.5 text-[#1A1A1A]"
            >
              <Menu className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </nav>


      {/* Full-Screen Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[200] flex flex-col"
          >
            <div className="max-w-[1440px] mx-auto w-full p-6 md:p-12 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-20">
                <span className="text-2xl font-black text-[#E31E24]" style={{ fontFamily: 'var(--font-heading)' }}>TYPEC</span>
                <button onClick={() => setIsSearchOpen(false)} className="p-3 bg-gray-100 rounded-full hover:bg-[#1A1A1A] hover:text-white transition-all">
                  <X className="w-8 h-8" />
                </button>
              </div>

              <div className="max-w-4xl mx-auto w-full">
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-12 text-[#1A1A1A]" style={{ fontFamily: 'var(--font-heading)' }}>Sizin İçin Ne <br /> Bulabiliriz?</h2>
                <SearchBar platform={isTypeC ? "B2C" : "B2B"} />

                <div className="mt-16">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">Popüler Aramalar</p>
                  <div className="flex flex-wrap gap-3">
                    {["Powerbank", "65W Adaptör", "USB-C Kablo", "Baseus GaN5"].map((tag) => (
                      <button key={tag} className="px-6 py-3 rounded-full border border-gray-100 text-sm font-bold hover:border-[#1A1A1A] transition-all">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-[120] flex flex-col p-8"
            >
              <div className="flex items-center justify-between mb-16">
                <span className="text-2xl font-black text-[#E31E24]" style={{ fontFamily: 'var(--font-heading)' }}>TYPEC</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-100 rounded-full">
                  <X className="w-6 h-6 text-[#1A1A1A]" />
                </button>
              </div>

              <nav className="flex-1 space-y-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between group"
                  >
                    <span className="text-2xl font-bold tracking-tight text-[#1A1A1A] group-hover:text-[#E31E24] transition-colors">{link.name}</span>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#E31E24] transition-colors" />
                  </Link>
                ))}
              </nav>

              <div className="pt-8 border-t border-gray-100 space-y-4">
                {user ? (
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full py-4 bg-[#1A1A1A] text-white text-center rounded-2xl font-bold text-sm uppercase tracking-widest"
                  >
                    Profilim
                  </Link>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full py-4 bg-[#1A1A1A] text-white text-center rounded-2xl font-bold text-sm uppercase tracking-widest"
                  >
                    Giriş Yap
                  </Link>
                )}
                <div className="flex items-center justify-center gap-4 text-gray-400">
                  <Link href="/faq" className="text-xs font-bold hover:text-[#1A1A1A]">Yardım Merkezi</Link>
                  <div className="w-1 h-1 rounded-full bg-gray-200" />
                  <Link href="/contact" className="text-xs font-bold hover:text-[#1A1A1A]">İletişim</Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
