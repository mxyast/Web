"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Modal } from "../../components/Modal";

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
  productCount: number;
}

export function DeleteCategoryButton({ categoryId, categoryName, productCount }: DeleteCategoryButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDeleteClick = () => {
    if (productCount > 0) {
      setShowWarningModal(true);
      return;
    }
    setShowConfirmModal(true);
  };

  const executeDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/categories/${categoryId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Bir hata oluştu.");
        setShowErrorModal(true);
        setIsDeleting(false);
      } else {
        window.location.reload();
      }
    } catch {
      setErrorMessage("Bağlantı hatası oluştu.");
      setShowErrorModal(true);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-end gap-1">
        <button
          onClick={handleDeleteClick}
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
      </div>

      {/* Warning Modal (Has Products) */}
      <Modal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        type="warning"
        title="Kategori Silinemez"
        message={`"${categoryName}" kategorisine bağlı ${productCount} ürün var. Önce ürünleri başka bir kategoriye taşıyın.`}
        confirmText="Anladım"
      />

      {/* Deletion Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        type="danger"
        title="Kategoriyi Sil"
        message={`"${categoryName}" kategorisini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
        onConfirm={executeDelete}
      />

      {/* Error Modal */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        type="danger"
        title="Hata Oluştu"
        message={errorMessage}
        confirmText="Kapat"
      />
    </>
  );
}
