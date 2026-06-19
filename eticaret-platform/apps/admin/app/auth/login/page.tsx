"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ShieldAlert, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Giriş başarısız. Lütfen bilgilerinizi ve admin yetkinizi kontrol edin.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("Beklenmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden px-4">
      {/* Background gradients for premium glassmorphism aesthetic */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Merkezi Yönetim Paneli</h1>
          <p className="text-slate-400 text-sm">Lütfen yönetici hesabı bilgilerinizle giriş yapın.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-start gap-3 text-red-400 text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2" htmlFor="email">
              E-Posta Adresi
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
              <input
                id="email"
                type="email"
                required
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                placeholder="isim@sirket.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2" htmlFor="password">
              Şifre
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
              <input
                id="password"
                type="password"
                required
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-blue-500 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Giriş Yap
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
