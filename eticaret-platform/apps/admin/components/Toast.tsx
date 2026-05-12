"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error";

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
}

export function Toast({ type, message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-sm transition-all animate-in slide-in-from-bottom-4 fade-in duration-300 ${
      type === "success"
        ? "bg-white border-green-100 shadow-green-100"
        : "bg-white border-red-100 shadow-red-100"
    }`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
        type === "success" ? "bg-green-50" : "bg-red-50"
      }`}>
        {type === "success"
          ? <CheckCircle2 className="w-5 h-5 text-green-600" />
          : <AlertTriangle className="w-5 h-5 text-red-600" />
        }
      </div>
      <p className={`text-sm font-bold ${type === "success" ? "text-green-800" : "text-red-800"}`}>
        {message}
      </p>
      <button onClick={onClose} className="ml-2 p-1 hover:bg-gray-100 rounded-lg transition-colors">
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
}

export function ToastContainer({ successParam }: { successParam?: string }) {
  const [visible, setVisible] = useState(!!successParam);

  useEffect(() => {
    if (successParam) {
      setVisible(true);
      // Clean the URL without a page reload
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      window.history.replaceState({}, "", url.toString());
    }
  }, [successParam]);

  if (!visible || !successParam) return null;

  const messages: Record<string, string> = {
    created: "✅ Ürün başarıyla oluşturuldu ve sisteme eklendi.",
    updated: "✅ Ürün başarıyla güncellendi.",
  };

  return (
    <Toast
      type="success"
      message={messages[successParam] || "İşlem başarıyla tamamlandı."}
      onClose={() => setVisible(false)}
    />
  );
}
