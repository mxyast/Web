"use client";

import { useState, useTransition } from "react";
import { Image as ImageIcon, Upload, Eye, CheckCircle, Edit3, X, Loader2 } from "lucide-react";
import { updateHomepageSection, publishHomepageSection } from "./actions";

interface Section {
  id: string;
  key: string;
  title: string;
  imageUrl: string | null;
  defaultImageUrl: string | null;
  categoryId: string | null;
  isDraft: boolean;
  category: { id: string; name: string } | null;
}

interface Category {
  id: string;
  name: string;
}

interface HomepageSectionManagerProps {
  sections: Section[];
  categories: Category[];
}

function SectionCard({ section, categories }: { section: Section; categories: Category[] }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const currentImage = section.imageUrl || section.defaultImageUrl || "";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("isDraft", "true"); // save as draft first
    startTransition(async () => {
      await updateHomepageSection(section.id, formData);
      setIsEditing(false);
      setPreviewImage(null);
    });
  };

  const handlePublish = () => {
    startTransition(async () => {
      await publishHomepageSection(section.id);
    });
  };

  const keyLabels: Record<string, string> = {
    chargers: "Şarj Üniteleri",
    audio: "Ses Sistemleri",
    smart: "Akıllı Yaşam",
  };

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{keyLabels[section.key] || section.key}</span>
          <p className="font-black text-slate-900 text-sm">{section.title}</p>
        </div>
        <div className="flex items-center gap-2">
          {section.isDraft && (
            <span className="text-[10px] font-black uppercase bg-amber-50 text-amber-600 border border-amber-100 px-2 py-1 rounded-lg">Taslak</span>
          )}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> Önizle
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            {isEditing ? <X className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            {isEditing ? "İptal" : "Düzenle"}
          </button>
          {section.isDraft && (
            <button
              onClick={handlePublish}
              disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-100 transition-colors disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
              Yayınla
            </button>
          )}
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="relative h-48 overflow-hidden border-b border-gray-50">
          <img
            src={previewImage || currentImage}
            alt={section.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <p className="text-white font-black text-xl tracking-[0.2em] uppercase">{section.title}</p>
          </div>
          <div className="absolute top-2 right-2 text-[10px] font-bold bg-black/60 text-white px-2 py-1 rounded-lg">
            Önizleme
          </div>
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="p-6 space-y-4 border-b border-gray-50 bg-gray-50/50">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Başlık</label>
            <input
              name="title"
              defaultValue={section.title}
              className="w-full bg-white border border-gray-100 rounded-xl py-2.5 px-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Kategori (link yönlendirmesi)</label>
            <select
              name="categoryId"
              defaultValue={section.categoryId || ""}
              className="w-full bg-white border border-gray-100 rounded-xl py-2.5 px-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none appearance-none"
            >
              <option value="">Seçilmedi (Tüm Ürünler)</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Görsel</label>
            <div className="flex gap-2">
              <input
                name="imageUrl"
                defaultValue={section.imageUrl || ""}
                placeholder="https://... (URL ile ekle)"
                className="flex-1 bg-white border border-gray-100 rounded-xl py-2.5 px-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
              <label className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors whitespace-nowrap">
                <Upload className="w-3.5 h-3.5" /> Yükle
                <input type="file" name="imageFile" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
            {!section.imageUrl && (
              <p className="text-[10px] text-gray-400 font-medium">Boş bırakılırsa varsayılan görsel kullanılır.</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              name="isDraft"
              value="true"
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 text-white text-xs font-black rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              Taslak Kaydet
            </button>
            <button
              type="button"
              onClick={async (e) => {
                const form = (e.currentTarget as HTMLButtonElement).closest("form") as HTMLFormElement;
                const formData = new FormData(form);
                formData.set("isDraft", "false");
                startTransition(async () => {
                  await updateHomepageSection(section.id, formData);
                  setIsEditing(false);
                  setPreviewImage(null);
                });
              }}
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white text-xs font-black rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Yayınla
            </button>
          </div>
        </form>
      )}

      {/* Current State */}
      <div className="px-6 py-4 flex items-center gap-4">
        <div className="w-16 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
          <img src={currentImage} alt={section.title} className="w-full h-full object-cover" />
        </div>
        <div className="text-xs font-medium text-gray-500">
          {section.category ? (
            <span>→ <span className="font-bold text-black">{section.category.name}</span> kategorisine yönlendiriyor</span>
          ) : (
            <span className="text-gray-400">Kategori seçilmemiş</span>
          )}
        </div>
      </div>
    </div>
  );
}

export function HomepageSectionManager({ sections, categories }: HomepageSectionManagerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-slate-800">Kategori Kartları</h2>
          <p className="text-xs text-gray-400 font-medium mt-0.5">Anasayfadaki 3 kategori kartını yönetin. Taslak olarak kaydedebilir, önizleyebilir ve yayınlayabilirsiniz.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map(section => (
          <SectionCard key={section.id} section={section} categories={categories} />
        ))}
      </div>
    </div>
  );
}
