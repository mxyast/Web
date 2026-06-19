"use client";

import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "neon" | "ghost" | "glass" | "orange";
  size?: "sm" | "md" | "lg";
}

export const Button = ({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) => {
  const variants = {
    primary: "bg-[#1A1A1A] text-white hover:opacity-90 shadow-sm",
    secondary: "bg-[var(--color-secondary, #f3f4f6)] text-[var(--color-text, #000)] hover:bg-opacity-80",
    outline: "border border-[var(--color-border, #e5e7eb)] bg-transparent hover:bg-gray-50",
    neon: "bg-black text-white shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] border border-[var(--color-neon-blue, #00f0ff)]/50",
    ghost: "bg-transparent hover:bg-gray-100",
    glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20",
    orange: "bg-gradient-to-br from-[#FF7D00] to-[#FF9F00] text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold transition-all disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...(props as any)}
    />
  );
};
