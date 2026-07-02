"use client";

import { useState } from "react";
import { ArrowLeft, Save, Info, Tag, Layers, Settings, Boxes, Image as ImageIcon, Link as LinkIcon, Upload, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import { createProduct, updateProduct } from "../actions";

function ReserveRatioSlider({ defaultValue }: { defaultValue: number }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Rezerve Oranı</span>
        <span className="text-base font-black text-blue-700">%{value}</span>
      </div>
      <input
        required
        min="0"
        max="100"
        name="b2cReserveRatio"
        type="range"
        value={value}
        onChange={e => setValue(Number(e.target.value))}
        className="w-full h-2 bg-blue-200 rounded-full appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-[10px] font-bold text-blue-400">
        <span>%0 (Tümü B2B)</span>
        <span>%100 (Tümü B2C)</span>
      </div>
    </div>
  );
}

export function ProductForm({ brands, categories, product = null }: { brands: any[], categories: any[], product?: any }) {
  const isEditing = !!product;
  const variant = product?.variants?.[0] || {};
  const inventory = variant?.inventory || {};
  const price = variant?.price || {};

  const [variants, setVariants] = useState<Array<{ id?: string, color: string, sku: string, barcode?: string, totalStock: number }>>(
    isEditing && product.variants?.length > 0
      ? product.variants.map((v: any) => ({
          id: v.id,
          color: v.color || "",
          sku: v.sku,
          barcode: v.barcode || "",
          totalStock: v.inventory?.totalStock || 0,
        }))
      : [{ color: "", sku: "", barcode: "", totalStock: 0 }]
  );

  const handleAddVariant = () => {
    setVariants([...variants, { color: "", sku: "", barcode: "", totalStock: 0 }]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    setVariants(
      variants.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const [isNewBrand, setIsNewBrand] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isB2C, setIsB2C] = useState<boolean>(isEditing ? !!product?.isB2C : true);
  const [isB2B, setIsB2B] = useState<boolean>(isEditing ? !!product?.isB2B : true);
  const showReserveRatio = isB2C && isB2B;

  // Existing images
  const initialImages = variant?.images || [];
  const [keptImages, setKeptImages] = useState<string[]>(initialImages);

  // New Image handling
  const [newImages, setNewImages] = useState<Array<{type: 'url' | 'file', value: string | File, id: number, error?: string}>>([]);
  const [nextImageId, setNextImageId] = useState(1);

  const handleAddImageUrl = () => {
    setNewImages([...newImages, { type: 'url', value: '', id: nextImageId }]);
    setNextImageId(prev => prev + 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const MAX_SIZE = 500 * 1024;
      const newFiles = Array.from(e.target.files).map((file, idx) => {
        const hasError = file.size > MAX_SIZE;
        return {
          type: 'file' as const,
          value: file,
          id: nextImageId + idx,
          error: hasError ? `"${file.name}" 500KB'yi aşıyor (${(file.size / 1024).toFixed(0)}KB). Lütfen daha küçük bir görsel seçin.` : undefined
        };
      });
      setNewImages([...newImages, ...newFiles]);
      setNextImageId(prev => prev + newFiles.length);
    }
    e.target.value = '';
  };

  const handleRemoveNewImage = (id: number) => {
    setNewImages(newImages.filter(img => img.id !== id));
  };

  const handleRemoveKeptImage = (imgUrl: string) => {
    setKeptImages(keptImages.filter(img => img !== imgUrl));
  };

  const handleUrlChange = (id: number, url: string) => {
    setNewImages(newImages.map(img => img.id === id ? { ...img, value: url } : img));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const hasErrors = newImages.some(img => img.error);
    if (hasErrors) {
      alert('Lütfen hatalı görselleri kaldırın ve tekrar deneyin.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      formData.append('keptImages', JSON.stringify(keptImages));

      newImages.forEach(img => {
        if (!img.error) {
          if (img.type === 'file') {
            formData.append('imageFiles', img.value as File);
          } else if (img.type === 'url' && img.value) {
            formData.append('imageUrls', img.value as string);
          }
        }
      });

      formData.append('variantsJson', JSON.stringify(variants));

      if (isEditing) {
        await updateProduct(product.id, variant.id, formData);
      } else {
        await createProduct(formData);
      }
    } catch (error: any) {
      if (error?.digest?.startsWith('NEXT_REDIRECT')) return;
      console.error(error);
      alert(isEditing ? "Ürün güncellenirken bir hata oluştu." : "Ürün eklenirken bir hata oluştu.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/products" className="p-2 bg-white rounded-full border border-gray-100 hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{isEditing ? "Ürünü Düzenle" : "Yeni Ürün Oluştur"}</h1>
        </div>
        <button disabled={isSubmitting} type="submit" className="bg-slate-900 text-white text-xs font-bold px-8 py-3 rounded-2xl hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-slate-900/20 disabled:opacity-70">
          <Save className="w-4 h-4" /> {isSubmitting ? "Kaydediliyor..." : (isEditing ? "Değişiklikleri Kaydet" : "Ürünü Kaydet")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT COLUMN */}
        <div className="md:col-span-2 space-y-8">
          {/* Basic Info */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
            <div className="flex items-center gap-2 mb-6">
              <Info className="w-5 h-5 text-gray-400" />
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Temel Bilgiler</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Ürün Adı</label>
                <input required name="name" type="text" defaultValue={product?.name} placeholder="Örn: Baseus 65W Hızlı Şarj Adaptörü" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Açıklama</label>
                <textarea required name="description" rows={4} defaultValue={product?.description} placeholder="Ürün özelliklerini ve detaylarını buraya girin..." className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"></textarea>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-gray-400" />
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Ürün Görselleri</h2>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={handleAddImageUrl} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" /> Link Ekle
                </button>
                <label className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1 cursor-pointer">
                  <Upload className="w-3 h-3" /> Yükle
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            </div>
            <div className="space-y-4">
              {keptImages.length === 0 && newImages.length === 0 && (
                <div className="text-center py-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Görsel Eklenmedi</p>
                  <p className="text-[10px] text-gray-400 font-medium">Link olarak ekleyebilir veya bilgisayarınızdan yükleyebilirsiniz.</p>
                </div>
              )}
              {keptImages.map((imgUrl, i) => {
                const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "";
                const displayUrl = imgUrl.startsWith('/uploads/') ? `${adminUrl}${imgUrl}` : imgUrl;
                return (
                  <div key={`kept-${i}`} className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <img src={displayUrl} className="w-10 h-10 object-cover rounded-lg shrink-0" alt="Ürün" />
                    <span className="flex-1 text-sm font-medium text-slate-700 truncate">{imgUrl.split('/').pop()}</span>
                    <button type="button" onClick={() => handleRemoveKeptImage(imgUrl)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
              {newImages.map(img => (
                <div key={img.id} className={`flex flex-col gap-2 p-3 rounded-xl border ${img.error ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex items-center gap-3">
                    {img.type === 'url' ? (
                      <>
                        <LinkIcon className="w-4 h-4 text-gray-400 shrink-0" />
                        <input type="url" value={img.value as string} onChange={(e) => handleUrlChange(img.id, e.target.value)} placeholder="https://ornek.com/resim.jpg" className="flex-1 bg-transparent border-none text-sm font-medium focus:ring-0 p-0 outline-none" />
                      </>
                    ) : (
                      <>
                        {img.error ? <AlertCircle className="w-4 h-4 text-red-500 shrink-0" /> : <ImageIcon className="w-4 h-4 text-gray-400 shrink-0" />}
                        <span className={`flex-1 text-sm font-medium truncate ${img.error ? 'text-red-700' : 'text-slate-700'}`}>{(img.value as File).name}</span>
                      </>
                    )}
                    <button type="button" onClick={() => handleRemoveNewImage(img.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {img.error && (
                    <p className="text-xs font-bold text-red-600 flex items-center gap-1.5 pl-1">
                      <AlertCircle className="w-3 h-3 shrink-0" /> {img.error}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
            <div className="flex items-center gap-2 mb-6">
              <Tag className="w-5 h-5 text-gray-400" />
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Fiyatlandırma</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {/* Retail */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Perakende Fiyatı (B2C)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₺</span>
                  <input required min="0" name="retailPrice" type="number" step="0.01" defaultValue={price?.retailPrice} placeholder="0.00" className="w-full bg-blue-50 border border-blue-100 rounded-2xl py-3 pl-10 pr-4 text-sm font-black text-blue-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                </div>
              </div>
              {/* KDV */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">KDV Oranı (%)</label>
                <input required min="0" name="taxRate" type="number" defaultValue={price?.taxRate || 20} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
              </div>
              {/* Liste A */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Liste A — Standart Bayi</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₺</span>
                  <input required min="0" name="listA" type="number" step="0.01" defaultValue={price?.listA} placeholder="0.00" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-10 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                </div>
              </div>
              {/* Liste B */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Liste B — Özel Bayi</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₺</span>
                  <input required min="0" name="listB" type="number" step="0.01" defaultValue={price?.listB} placeholder="0.00" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-10 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                </div>
              </div>
              {/* Liste C */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Liste C — VIP Bayi</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₺</span>
                  <input required min="0" name="listC" type="number" step="0.01" defaultValue={price?.listC} placeholder="0.00" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-10 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                </div>
              </div>
              {/* Liste D */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Liste D — Kurumsal</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₺</span>
                  <input required min="0" name="listD" type="number" step="0.01" defaultValue={price?.listD} placeholder="0.00" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-10 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          {/* Category & Brand */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
            <div className="flex items-center gap-2 mb-6">
              <Layers className="w-5 h-5 text-gray-400" />
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Sınıflandırma</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Kategori</label>
                  <button type="button" onClick={() => setIsNewCategory(!isNewCategory)} className="text-[10px] font-bold text-blue-600 hover:underline">
                    {isNewCategory ? "Listeden Seç" : "Yeni Ekle"}
                  </button>
                </div>
                {isNewCategory ? (
                  <input required name="newCategoryName" type="text" placeholder="Yeni kategori adı..." className="w-full bg-blue-50 border border-blue-100 rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                ) : (
                  <select required name="categoryId" defaultValue={product?.categoryId || ""} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none">
                    <option value="">Seçiniz...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Marka</label>
                  <button type="button" onClick={() => setIsNewBrand(!isNewBrand)} className="text-[10px] font-bold text-blue-600 hover:underline">
                    {isNewBrand ? "Listeden Seç" : "Yeni Ekle"}
                  </button>
                </div>
                {isNewBrand ? (
                  <input required name="newBrandName" type="text" placeholder="Yeni marka adı..." className="w-full bg-blue-50 border border-blue-100 rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                ) : (
                  <select required name="brandId" defaultValue={product?.brandId || ""} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none">
                    <option value="">Seçiniz...</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Inventory & SKU */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-gray-400" />
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Renk Varyantları</h2>
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
              >
                + Renk Ekle
              </button>
            </div>
            
            <div className="space-y-6">
              {variants.map((v, index) => (
                <div key={index} className="p-5 bg-gray-50 border border-gray-100 rounded-2xl relative space-y-4">
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(index)}
                      className="absolute top-4 right-4 text-xs font-bold text-red-500 hover:text-red-700"
                    >
                      Kaldır
                    </button>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Renk Adı</label>
                      <input
                        required
                        type="text"
                        value={v.color}
                        onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                        placeholder="Örn: Siyah / Gümüş"
                        className="w-full bg-white border border-gray-100 rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Stok Kodu (SKU)</label>
                      <input
                        required
                        type="text"
                        value={v.sku}
                        onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                        placeholder="Örn: BAS-65W-BLK"
                        className="w-full bg-white border border-gray-100 rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all uppercase"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Barkod (EAN/UPC)</label>
                      <input
                        type="text"
                        value={v.barcode}
                        onChange={(e) => handleVariantChange(index, "barcode", e.target.value)}
                        placeholder="Opsiyonel"
                        className="w-full bg-white border border-gray-100 rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Toplam Stok</label>
                      <input
                        required
                        min="0"
                        type="number"
                        value={v.totalStock}
                        onChange={(e) => handleVariantChange(index, "totalStock", Number(e.target.value))}
                        className="w-full bg-white border border-gray-100 rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Channel Visibility */}
          <div className="bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200 p-8 text-white">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-5 h-5 text-slate-400" />
              <h2 className="text-sm font-black uppercase tracking-widest text-white/60">Kanal Görünürlüğü</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl cursor-pointer transition-colors">
                <span className="text-sm font-bold">B2C Perakende</span>
                <input type="checkbox" name="isB2C" checked={isB2C} onChange={e => setIsB2C(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </label>
              <label className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl cursor-pointer transition-colors">
                <span className="text-sm font-bold">B2B Toptan</span>
                <input type="checkbox" name="isB2B" checked={isB2B} onChange={e => setIsB2B(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </label>
            </div>
          </div>

          {/* B2C Reserve Ratio — only when both channels are active */}
          {showReserveRatio && (
            <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-6">
              <div className="flex items-center gap-2 mb-1">
                <Settings className="w-4 h-4 text-blue-500" />
                <h2 className="text-xs font-black uppercase tracking-widest text-blue-700">B2C Rezerve Oranı</h2>
              </div>
              <p className="text-[11px] text-blue-500 font-medium mb-5">
                Her iki kanal aktif olduğunda perakende için stoktan ne kadar ayrılacağını belirleyin.
              </p>
              <ReserveRatioSlider defaultValue={inventory?.b2cReserveRatio ?? 20} />
            </div>
          )}

          {/* If only one channel, still send b2cReserveRatio */}
          {!showReserveRatio && (
            <input type="hidden" name="b2cReserveRatio" value={inventory?.b2cReserveRatio ?? 0} />
          )}
        </div>
      </div>
    </form>
  );
}
