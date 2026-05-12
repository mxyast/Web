"use client";

import { RefreshCw, ChevronDown } from "lucide-react";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        <button 
          onClick={async () => {
            const res = await fetch("/api/inventory/sync", { method: "POST" });
            const data = await res.json();
            if (data.success) alert("Stok senkronize edildi!");
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Stok Senkronize Et
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-[var(--color-admin-accent)] flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">Sistem Yöneticisi</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </header>
  );
}
