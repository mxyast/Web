"use client";

import { useState, useTransition } from "react";
import { Edit3, X, Upload, Eye, CheckCircle, Loader2 } from "lucide-react";
import { updateHomepageBanner, publishHomepageBanner } from "./actions";

interface Banner {
  id: string;
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  imageUrl: string | null;
  isDraft: boolean;
}

interface HomepageBannerManagerProps {
  banner: Banner | null;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?q=80&w=2070&auto=format&fit=crop";

export function HomepageBannerManager({ banner }: HomepageBannerManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [form, setForm] = useState({
    badge: banner?.badge || "BASEUS EXCLUSIVE",
    title: banner?.title || "ŞARJIN GELECEĞİ",
    titleHighlight: banner?.titleHighlight || "GAn5 PRO.",
    description: banner?.description || "",
    buttonText: banner?.buttonText || "LANSMAN ÜRÜNLERİ",
    buttonUrl: banner?.buttonUrl || "/products",
    imageUrl: banner?.imageUrl || "",
  });

  const currentImage = previewImage || form.imageUrl || DEFAULT_IMAGE;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (isDraft: boolean) => (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("isDraft", isDraft ? "true" : "false");
    startTransition(async () => {
      await updateHomepageBanner(banner?.id || null, formData);
      setIsEditing(false);
      setPreviewImage(null);
    });
  };

  const handlePublish = () => {
    if (!banner?.id) return;
    startTransition(async () => {
      await publishHomepageBanner(banner.id);
    });
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-gray-50">
        <div>
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Kampanya Banner</h2>
          <p className="text-xs text-gray-400 font-medium mt-0.5">Anasayfadaki büyük kampanya bölümünü düzenleyin.</p>
        </div>
        <div className="flex items-center gap-2">
          {banner?.isDraft && (
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
          {banner?.isDraft && (
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
        <div className="relative overflow-hidden border-b border-gray-50">
          <div className="bg-[#1A1A1A] flex flex-col lg:flex-row">
            <div className="flex-1 p-10">
              <span className="text-[#E31E24] font-bold text-[10px] tracking-[0.4em] mb-4 block uppercase">{form.badge}</span>
              <h3 className="text-3xl font-black tracking-tighter mb-6 text-white leading-[0.95]">
                {form.title} <br />
                <span className="text-[#E31E24]">{form.titleHighlight}</span>
              </h3>
              <p className="text-gray-400 font-medium mb-6 max-w-md text-sm leading-relaxed">{form.description}</p>
              <div className="inline-flex items-center gap-3 bg-white text-[#1A1A1A] px-6 py-3 rounded-full font-black text-xs uppercase tracking-[0.2em]">
                {form.buttonText}
              </div>
            </div>
            <div className="w-full lg:w-64 h-48 lg:h-auto overflow-hidden shrink-0 relative">
              <img src={currentImage} alt="Banner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#1A1A1A]/30" />
            </div>
          </div>
          <div className="absolute top-2 right-2 text-[10px] font-bold bg-black/60 text-white px-2 py-1 rounded-lg">
            Önizleme
          </div>
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <form onSubmit={handleSubmit(true)} className="p-8 space-y-5 border-b border-gray-50 bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rozet Yazısı</label>
              <input name="badge" value={form.badge} onChange={e => setForm(f => ({...f, badge: e.target.value}))}
                className="w-full bg-white border border-gray-100 rounded-xl py-2.5 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ana Başlık</label>
              <input name="title" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))}
                className="w-full bg-white border border-gray-100 rounded-xl py-2.5 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Vurgulu Başlık (kırmızı)</label>
              <input name="titleHighlight" value={form.titleHighlight} onChange={e => setForm(f => ({...f, titleHighlight: e.target.value}))}
                className="w-full bg-white border border-gray-100 rounded-xl py-2.5 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Buton Metni</label>
              <input name="buttonText" value={form.buttonText} onChange={e => setForm(f => ({...f, buttonText: e.target.value}))}
                className="w-full bg-white border border-gray-100 rounded-xl py-2.5 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Buton URL</label>
              <input name="buttonUrl" value={form.buttonUrl} onChange={e => setForm(f => ({...f, buttonUrl: e.target.value}))}
                className="w-full bg-white border border-gray-100 rounded-xl py-2.5 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Açıklama</label>
            <textarea name="description" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3}
              className="w-full bg-white border border-gray-100 rounded-xl py-2.5 px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Görsel</label>
            <div className="flex gap-2">
              <input name="imageUrl" value={form.imageUrl} onChange={e => setForm(f => ({...f, imageUrl: e.target.value}))}
                placeholder="https://... veya boş bırakın"
                className="flex-1 bg-white border border-gray-100 rounded-xl py-2.5 px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20" />
              <label className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors whitespace-nowrap">
                <Upload className="w-3.5 h-3.5" /> Yükle
                <input type="file" name="imageFile" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 text-white text-xs font-black rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50">
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Taslak Kaydet
            </button>
            <button type="button" disabled={isPending}
              onClick={(e) => {
                const form = (e.currentTarget as HTMLButtonElement).closest("form") as HTMLFormElement;
                const fd = new FormData(form);
                fd.set("isDraft", "false");
                startTransition(async () => {
                  await updateHomepageBanner(banner?.id || null, fd);
                  setIsEditing(false);
                  setPreviewImage(null);
                });
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white text-xs font-black rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50">
              <CheckCircle className="w-3.5 h-3.5" /> Yayınla
            </button>
          </div>
        </form>
      )}

      {/* Current Info */}
      {!isEditing && banner && (
        <div className="px-8 py-5 flex items-center gap-6">
          <div className="w-20 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
            <img src={banner.imageUrl || DEFAULT_IMAGE} alt="Banner" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-black text-sm text-slate-900">{banner.title} <span className="text-typec-red">{banner.titleHighlight}</span></p>
            <p className="text-xs text-gray-400 font-medium mt-1 max-w-md truncate">{banner.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
