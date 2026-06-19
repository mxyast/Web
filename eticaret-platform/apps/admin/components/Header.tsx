"use client";

import { useState } from "react";
import { RefreshCw, ChevronDown, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        <button 
          onClick={async () => {
            const res = await fetch("/api/inventory/sync", { method: "POST" });
            const data = await res.json();
            if (data.success) alert("Stok senkronize edildi!");
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Stok Senkronize Et
        </button>
      </div>
      
      <div className="flex items-center gap-4 relative">
        <div 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 transition-colors select-none"
        >
          <div className="w-8 h-8 rounded-full bg-[var(--color-admin-accent)] flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <span className="text-sm font-semibold text-gray-700 hidden sm:block">Sistem Yöneticisi</span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </div>

        {/* User Dropdown Menu */}
        {dropdownOpen && (
          <>
            {/* Backdrop overlay to close dropdown on click outside */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute right-0 top-12 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
              <Link 
                href="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 font-medium"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                Genel Ayarlar
              </Link>
              <hr className="border-gray-100 my-1" />
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  signOut({ callbackUrl: "/auth/login" });
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold cursor-pointer text-left"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                Çıkış Yap
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
