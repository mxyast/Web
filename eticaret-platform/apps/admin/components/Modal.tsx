"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, HelpCircle, Info, X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "danger" | "confirm";
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  onConfirm,
  confirmText = "Tamam",
  cancelText = "İptal",
}: ModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        );
      case "warning":
        return (
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
        );
      case "danger":
        return (
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
        );
      case "confirm":
        return (
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
            <HelpCircle className="w-6 h-6" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
            <Info className="w-6 h-6" />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden relative p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:text-slate-800 hover:bg-gray-50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {getIcon()}

        <h3 className="mt-6 text-lg font-black text-slate-800 tracking-tight">
          {title}
        </h3>
        <p className="mt-2.5 text-sm font-semibold text-gray-500 leading-relaxed max-w-xs">
          {message}
        </p>

        <div className="mt-8 flex gap-3 w-full">
          {type === "confirm" || type === "danger" ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-5 py-3 rounded-2xl border border-gray-100 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onConfirm) onConfirm();
                  onClose();
                }}
                className={`flex-1 px-5 py-3 rounded-2xl text-xs font-bold text-white shadow-lg transition-all ${
                  type === "danger"
                    ? "bg-red-500 hover:bg-red-600 shadow-red-500/25"
                    : "bg-slate-900 hover:bg-slate-800 shadow-slate-900/25"
                }`}
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white shadow-lg shadow-slate-900/25 transition-colors"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
