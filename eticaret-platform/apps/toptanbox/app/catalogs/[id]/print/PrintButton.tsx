"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
    >
      <Printer className="w-4 h-4" /> PDF Olarak Kaydet / Yazdır
    </button>
  );
}
