"use client";

import { Box, ArrowRight, Filter } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CatalogList({ templates }: { templates: any[] }) {
  return (
    <div className="lg:col-span-2">
       <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-slate-900">Hazır Kataloglar</h3>
          <div className="flex gap-2">
             <button className="p-2 rounded-lg bg-white border border-gray-100 hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4 text-gray-400" />
             </button>
          </div>
       </div>
       
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {templates.length === 0 ? (
            <div className="col-span-2 text-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-sm font-black text-slate-800 mb-2">Henüz Katalog Şablonu Yok</h3>
              <p className="text-xs text-gray-500">Sistemde yayınlanmış bir katalog şablonu bulunamadı.</p>
            </div>
          ) : (
            templates.map((cat) => (
              <Link key={cat.id} href={`/catalogs/${cat.id}/print`}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="group bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer h-full flex flex-col"
                >
                  <div className="aspect-[4/5] bg-slate-50 rounded-[2rem] mb-6 flex flex-col items-center justify-center relative overflow-hidden group-hover:bg-slate-900/5 transition-colors">
                     <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 z-10">
                        <Box className="w-8 h-8 text-gray-300" />
                     </div>
                     <h4 className="text-xl font-black text-slate-400 z-10 text-center px-4">{cat.name}</h4>
                     
                     {/* Decorative bottom bar */}
                     <div className="absolute bottom-6 left-6 right-6">
                        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                           <div className="h-full bg-[var(--color-toptan-orange)] w-1/3 group-hover:w-full transition-all duration-500" />
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                     <div>
                        <h4 className="font-bold text-slate-900 line-clamp-1">{cat.name}</h4>
                        <p className="text-xs text-gray-400 font-medium">{cat.type}</p>
                     </div>
                     <button className="w-10 h-10 shrink-0 rounded-full bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                        <ArrowRight className="w-4 h-4" />
                     </button>
                  </div>
                </motion.div>
              </Link>
            ))
          )}
       </div>
    </div>
  );
}
