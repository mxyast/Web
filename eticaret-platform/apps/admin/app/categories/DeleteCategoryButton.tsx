"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
  productCount: number;
}

export function DeleteCategoryButton({ categoryId, categoryName, productCount }: DeleteCategoryButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (productCount > 0) {
      alert(`"${categoryName}" kategorisine bağlı ${productCount} ürün var. Önce ürünleri başka bir kategoriye taşıyın.`);
      return;
    }

    if (!confirm(`"${categoryName}" kategorisini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/categories/${categoryId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Bir hata oluştu.");
        setIsDeleting(false);
      } else {
        window.location.reload();
      }
    } catch {
      setError("Bağlantı hatası.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
          productCount > 0
            ? "text-gray-300 cursor-not-allowed bg-gray-50"
            : "text-red-500 hover:bg-red-50 hover:text-red-600"
        }`}
        title={productCount > 0 ? `${productCount} ürün var, silinemez` : "Sil"}
      >
        {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        Sil
      </button>
      {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}
    </div>
  );
}
