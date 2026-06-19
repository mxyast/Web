"use client";

import { useState, useEffect } from "react";
import { getProductsForCatalog } from "../actions";
import { CheckSquare, Square, Box, Loader2 } from "lucide-react";

type Product = {
  id: string;
  name: string;
  variants: { sku: string; images: string[] }[];
};

export default function CatalogProductSelector({ 
  brands, 
  categories,
  initialBrandId = "",
  initialCategoryId = "",
  initialIncludedProductIds = []
}: { 
  brands: any[], 
  categories: any[],
  initialBrandId?: string,
  initialCategoryId?: string,
  initialIncludedProductIds?: string[]
}) {
  const [brandId, setBrandId] = useState(initialBrandId);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(initialIncludedProductIds));
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If brand or category changes after initial load, we fetch new products.
  // We keep selectedIds only if they were passed initially, else we reset if category/brand changes manually.
  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const data = await getProductsForCatalog(brandId, categoryId);
        setProducts(data);
        
        // Sadece ilk yüklemede değil, marka/kategori değiştiğinde eğer initialBrandId ile eşleşmiyorsa seçimi sıfırla
        if (brandId !== initialBrandId || categoryId !== initialCategoryId) {
            setSelectedIds(new Set());
        }
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || "Bilinmeyen bir hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, [brandId, categoryId, initialBrandId, initialCategoryId]);

  const toggleSelectAll = () => {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set()); // Deselect all
    } else {
      setSelectedIds(new Set(products.map(p => p.id))); // Select all
    }
  };

  const toggleProduct = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  return (
    <div className="space-y-8">
      {/* Hidden input to pass selected IDs to the server action */}
      <input type="hidden" name="includedProductIds" value={JSON.stringify(Array.from(selectedIds))} />

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Sadece Bu Marka (Opsiyonel)</label>
          <select 
            name="brandId" 
            value={brandId} 
            onChange={(e) => setBrandId(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none"
          >
            <option value="">Tüm Markalar</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Sadece Bu Kategori (Opsiyonel)</label>
          <select 
            name="categoryId" 
            value={categoryId} 
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="border border-gray-100 rounded-3xl overflow-hidden bg-slate-50/50">
        <div className="bg-slate-100 p-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-3">
             <button 
               type="button" 
               onClick={toggleSelectAll} 
               className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-black transition-colors"
             >
               {selectedIds.size === products.length && products.length > 0 ? (
                 <CheckSquare className="w-5 h-5 text-blue-600" />
               ) : (
                 <Square className="w-5 h-5 text-gray-400" />
               )}
               Tümünü Seç ({selectedIds.size} / {products.length})
             </button>
          </div>
          {isLoading && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
        </div>

        <div className="p-2 max-h-[400px] overflow-y-auto space-y-1">
          {errorMsg && (
            <div className="text-center py-10 text-red-500 text-sm font-bold">
              Hata: {errorMsg}
            </div>
          )}
          {!errorMsg && products.length === 0 && !isLoading ? (
            <div className="text-center py-10 text-gray-400 text-sm font-medium flex flex-col items-center">
              <Box className="w-8 h-8 mb-2 opacity-50" />
              Bu filtrelere uygun B2B ürünü bulunamadı.
            </div>
          ) : (
            products.map((product) => {
              const isSelected = selectedIds.has(product.id);
              return (
                <div 
                  key={product.id} 
                  onClick={() => toggleProduct(product.id)}
                  className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all border ${
                    isSelected ? 'bg-blue-50 border-blue-100' : 'bg-white border-transparent hover:bg-gray-100'
                  }`}
                >
                  {isSelected ? (
                    <CheckSquare className="w-5 h-5 text-blue-600 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-300 shrink-0" />
                  )}
                  
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                    {product.variants[0]?.images[0] ? (
                       <img src={product.variants[0].images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                       <Box className="w-5 h-5 text-gray-200" />
                    )}
                  </div>

                  <div>
                    <h4 className={`text-sm font-bold line-clamp-1 ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                      {product.name}
                    </h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      SKU: {product.variants[0]?.sku || "Yok"}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
