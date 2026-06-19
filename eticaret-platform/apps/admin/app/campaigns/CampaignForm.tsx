"use client";

import { useState } from "react";
import { createCampaign, updateCampaign, deleteCampaign } from "./actions";
import { useRouter } from "next/navigation";
import { Check, Trash2, Search } from "lucide-react";

type ProductType = { id: string; name: string; brand: { name: string } };

export function CampaignForm({
  initialData,
  allProducts
}: {
  initialData?: any;
  allProducts: ProductType[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || "",
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().slice(0, 10) : "",
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().slice(0, 10) : "",
    isActive: initialData?.isActive ?? true,
    platform: initialData?.platform || "TYPEC",
  });

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    initialData?.products?.map((p: any) => p.id) || []
  );

  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.brand.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleProduct = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData) {
        await updateCampaign(initialData.id, {
          ...formData,
          productIds: selectedProductIds,
        } as any);
      } else {
        await createCampaign({
          ...formData,
          productIds: selectedProductIds,
        } as any);
      }
      router.push("/campaigns?success=1");
    } catch (error) {
      console.error(error);
      alert("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu kampanyayı silmek istediğinize emin misiniz?")) return;
    setLoading(true);
    try {
      await deleteCampaign(initialData.id);
      router.push("/campaigns?success=1");
    } catch (error) {
      console.error(error);
      alert("Silme başarısız.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Kampanya Adı *</label>
          <input
            required
            type="text"
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Platform</label>
          <select
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
          >
            <option value="TYPEC">TYPEC (B2C)</option>
            <option value="TOPTANBOX">TOPTANBOX (B2B)</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Açıklama</label>
          <textarea
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Afiş Görseli (URL)</label>
          <input
            type="text"
            placeholder="https://..."
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />
          {formData.imageUrl && (
            <img src={formData.imageUrl} alt="Preview" className="mt-4 rounded-xl max-h-40 object-cover" />
          )}
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Başlangıç Tarihi *</label>
          <input
            required
            type="date"
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Bitiş Tarihi *</label>
          <input
            required
            type="date"
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>

        <div className="md:col-span-2 flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="text-sm font-bold text-slate-800 cursor-pointer">
            Kampanya Aktif
          </label>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-8 mb-8">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-4 flex items-center justify-between">
          <span>Ürün Seçimi ({selectedProductIds.length} Seçili)</span>
        </h3>
        
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Ürün Ara..."
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 pl-10 text-sm font-medium outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        <div className="max-h-64 overflow-y-auto border border-gray-100 rounded-xl divide-y divide-gray-50">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              onClick={() => toggleProduct(product.id)}
              className="flex items-center gap-4 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${selectedProductIds.includes(product.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                {selectedProductIds.includes(product.id) && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{product.name}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{product.brand.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-6">
        {initialData ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="text-red-500 font-bold text-sm px-4 py-2 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Sil
          </button>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-slate-900 text-white text-sm font-bold px-8 py-2.5 rounded-xl hover:bg-black transition-all shadow-lg shadow-slate-900/20 disabled:opacity-50"
          >
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
    </form>
  );
}
