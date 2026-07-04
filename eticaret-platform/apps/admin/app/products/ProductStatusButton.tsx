"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { activateProduct, deactivateProduct } from "./actions";
import { Modal } from "../../components/Modal";

interface ProductStatusButtonProps {
  productId: string;
  isActive: boolean;
}

export function ProductStatusButton({ productId, isActive }: ProductStatusButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleToggle = async () => {
    if (isActive) {
      setShowConfirmModal(true);
    } else {
      await executeToggle(true); // directly activate without confirmation
    }
  };

  const executeToggle = async (toActive: boolean) => {
    setIsPending(true);
    try {
      if (toActive) {
        await activateProduct(productId);
      } else {
        await deactivateProduct(productId);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Bir hata oluştu.");
      setShowErrorModal(true);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-75 ${
          isActive
            ? "text-red-500 hover:bg-red-50 hover:text-red-600"
            : "text-green-600 hover:bg-green-50 hover:text-green-700"
        }`}
        title={isActive ? "Satışa Kapat" : "Satışa Aç"}
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : isActive ? (
          <EyeOff className="w-3.5 h-3.5" />
        ) : (
          <Eye className="w-3.5 h-3.5" />
        )}
        {isActive ? "Satışa Kapat" : "Satışa Aç"}
      </button>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        type="confirm"
        title="Satışa Kapatma Onayı"
        message="Bu ürünü satışa kapatmak istediğinize emin misiniz? Ürün tüm mağazalarda gizlenecektir."
        confirmText="Satışa Kapat"
        cancelText="Vazgeçtiniz"
        onConfirm={() => executeToggle(false)}
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
