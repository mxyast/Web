"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { loginAction } from "./action";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginAction(formData);
      if (res?.error) {
        setError(res.error);
        setIsPending(false);
      }
    } catch (err) {
      // Redirects thrown by NextAuth will be caught here if not handled gracefully by the framework,
      // but usually the page unmounts and redirects.
      console.error(err);
    }
  };

  return (
    <main className="flex-1 py-12 md:py-20 pt-32 flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-2xl shadow-gray-100">
          <div className="text-center mb-10">
             <div className="w-16 h-16 bg-black rounded-3xl mx-auto mb-6 flex items-center justify-center transform rotate-12 hover:rotate-0 transition-all duration-300">
                <span className="text-white font-black text-2xl">C</span>
             </div>
             <h1 className="text-3xl font-black mb-2 tracking-tight">Hoş Geldiniz</h1>
             <p className="text-gray-500 text-sm font-medium">
               Devam etmek için hesabınıza giriş yapın
             </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input 
              name="email" 
              type="email" 
              label="E-Posta Adresi" 
              placeholder="ornek@email.com" 
              required 
            />
            <Input 
              name="password" 
              type="password" 
              label="Şifre" 
              placeholder="••••••••" 
              required 
            />

            {error && (
              <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-sm font-bold text-center border border-red-100">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full group" disabled={isPending}>
              {isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-xs text-gray-500 font-medium">
              Hesabınız yok mu?{" "}
              <Link href="/auth/register" className="font-black text-black hover:underline uppercase tracking-widest ml-1">
                Kayıt Olun
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
