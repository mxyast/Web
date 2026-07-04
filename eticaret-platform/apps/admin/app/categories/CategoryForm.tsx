"use client";

import React, { useState, useRef } from "react";
import { Plus, Loader2 } from "lucide-react";
import { createCategory } from "./actions";

interface CategoryFormProps {
  parentCategories: { id: string; name: string }[];
}

export function CategoryForm({ parentCategories }: CategoryFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await createCategory(formData);
      formRef.current?.reset();
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 space-y-6">
      <div>
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Yeni Kategori Ekle</h2>
        <p className="text-[11px] font-bold text-gray-400 mt-1">Siteniz için yeni ana kategori veya alt kategori oluşturun.</p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Kategori Adı</label>
          <input
            required
            name="name"
            type="text"
            placeholder="Örn: Kulaklıklar"
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Üst Kategori (Opsiyonel)</label>
          <select
            name="parentId"
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none"
          >
            <option value="">Ana Kategori Yap</option>
            {parentCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-xs font-bold text-red-500 bg-red-50 px-4 py-2.5 rounded-xl border border-red-100">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-slate-900 text-white text-xs font-bold py-3.5 rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10 disabled:opacity-75"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {isPending ? "Kaydediliyor..." : "Kategori Ekle"}
        </button>
      </form>
    </div>
  );
}
