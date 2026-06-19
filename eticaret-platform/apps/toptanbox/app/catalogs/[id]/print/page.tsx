import { prisma } from "@eticaret/database";
import { notFound } from "next/navigation";
import { X } from "lucide-react";
import Link from "next/link";
import { auth } from "../../../../auth";
import PrintButton from "./PrintButton";

export default async function CatalogPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const template = await prisma.catalogTemplate.findUnique({
    where: { id },
    include: { brand: true, category: true }
  });

  if (!template) {
    notFound();
  }

  // Fetch B2B products matching the template's included products
  const whereClause: any = { 
    isB2B: true, 
    isActive: true,
  };
  
  // If the template explicitly specifies included products, filter by them.
  // Otherwise, no products will be shown since this is an inclusion-based model.
  if (template.includedProductIds && template.includedProductIds.length > 0) {
    whereClause.id = { in: template.includedProductIds };
  } else {
    // If no products were selected, return an empty array of products
    whereClause.id = { in: [] };
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      brand: true,
      category: true,
      variants: {
        include: { price: true }
      }
    },
    orderBy: [
      { categoryId: 'asc' },
      { name: 'asc' }
    ]
  });

  // Basic layout for printing
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Non-printable UI for controls */}
      <div className="w-full bg-slate-900 text-white p-4 flex items-center justify-between print:hidden sticky top-0 z-50 shadow-xl">
        <div className="flex items-center gap-4">
           <Link href="/catalogs" className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-5 h-5" />
           </Link>
           <div>
              <h1 className="font-bold text-sm">{template.name}</h1>
              <p className="text-[10px] text-gray-400">Yazdırma Önizlemesi</p>
           </div>
        </div>
        <PrintButton />
      </div>

      {/* Printable A4 Pages */}
      <div className="w-full max-w-[210mm] print:max-w-none mx-auto my-8 print:my-0 space-y-8 print:space-y-0">
         {/* Cover Page */}
         <div className="bg-white shadow-lg print:shadow-none min-h-[297mm] p-12 flex flex-col items-center justify-center text-center relative break-after-page">
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="z-10">
               <h1 className="text-6xl font-black text-slate-900 mb-6 uppercase tracking-tight">{template.name}</h1>
               <p className="text-xl text-gray-500 mb-12 max-w-lg mx-auto">{template.description || "ToptanBox B2B Katalog Sürümü"}</p>
               
               <div className="flex flex-col items-center gap-4">
                  {template.brand && <span className="px-6 py-2 bg-slate-100 rounded-full text-sm font-bold text-slate-700">Marka: {template.brand.name}</span>}
                  {template.category && <span className="px-6 py-2 bg-slate-100 rounded-full text-sm font-bold text-slate-700">Kategori: {template.category.name}</span>}
               </div>
            </div>
            <div className="absolute bottom-12 left-0 right-0 text-center">
               <p className="text-xs font-black uppercase tracking-widest text-gray-400">ToptanBox B2B Platformu • {new Date().getFullYear()}</p>
            </div>
         </div>

         {/* Products Grid Page(s) */}
         <div className="bg-white shadow-lg print:shadow-none min-h-[297mm] p-12">
            <h2 className="text-2xl font-black text-slate-900 mb-8 border-b-2 border-slate-900 pb-4">Ürün Listesi</h2>
            
            <div className="grid grid-cols-3 gap-6">
                {products.map((product: any) => {
                  const variant = product.variants[0];
                  const price = variant?.price;
                  return (
                    <div key={product.id} className="border border-gray-200 rounded-xl p-4 break-inside-avoid">
                       <div className="aspect-square bg-gray-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                          {variant?.images?.[0] ? (
                             <img src={variant.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                             <span className="text-gray-300 font-bold text-xs">Görsel Yok</span>
                          )}
                       </div>
                       <h3 className="font-bold text-xs text-slate-900 line-clamp-2 mb-1">{product.name}</h3>
                       <p className="text-[9px] font-bold text-gray-400 uppercase mb-3">SKU: {variant?.sku || "Yok"}</p>
                       
                       <div className="bg-slate-50 p-2 rounded-lg">
                          <p className="text-[10px] text-gray-500 font-bold mb-1">Toptan Liste Fiyatı:</p>
                          <p className="text-sm font-black text-blue-700">
                            {price?.listA ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(Number(price.listA)) : "Fiyat Yok"}
                          </p>
                       </div>
                    </div>
                  );
               })}
            </div>
         </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          // Add print CSS dynamically if needed, though tailwind print:* works well.
          const style = document.createElement('style');
          style.innerHTML = '@page { size: A4; margin: 0; } @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }';
          document.head.appendChild(style);
        `
      }} />
    </div>
  );
}
