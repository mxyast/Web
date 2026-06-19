"use client";

import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ className, label, error, ...props }: InputProps) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-typec-muted)] ml-1">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full bg-[#F8F8F8] border border-transparent rounded-2xl px-5 py-3.5 text-sm transition-all focus:bg-white focus:border-[var(--color-typec-border)] focus:shadow-xl focus:shadow-gray-200/50 outline-none placeholder:text-gray-400",
          error && "border-red-500 focus:border-red-500 focus:shadow-red-50/50",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-[10px] font-bold text-red-500 ml-1 uppercase tracking-tighter">
          {error}
        </p>
      )}
    </div>
  );
};
