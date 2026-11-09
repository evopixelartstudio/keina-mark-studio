"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useStore } from "@/context/StoreContext";
import { Lock, Mail, ShieldCheck, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { loginAsDemoAdmin, loginAsDemoCustomer } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    setError(null);

    const isKeina = email.toLowerCase().includes("keina") || email.toLowerCase().includes("admin");
    if (isKeina) {
      loginAsDemoAdmin();
      router.push("/admin");
    } else {
      loginAsDemoCustomer();
      router.push("/minha-conta");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1E9] text-[#242522]">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-[#FAF7F2] border border-[#E8E2D5] p-8 sm:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#70775E] font-medium block">
              Identificação
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl font-light text-[#242522]">
              Acesse sua Conta
            </h1>
            <p className="text-xs text-[#242522]/70 font-sans">
              Entre para gerenciar seus endereços de entrega ou acessar o painel administrativo.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800 font-sans">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#242522]/70 block font-medium">
                E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6C6F65] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F5F1E9] border border-[#E8E2D5] focus:outline-none focus:border-[#87563B]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-wider text-[#242522]/70 block font-medium">
                  Senha
                </label>
                <Link
                  href="/recuperar-senha"
                  className="text-[11px] text-[#87563B] hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6C6F65] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F5F1E9] border border-[#E8E2D5] focus:outline-none focus:border-[#87563B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#242522] text-[#F5F1E9] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#87563B] disabled:opacity-50 transition-colors mt-2"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Quick testing shortcut buttons */}
          <div className="pt-4 border-t border-[#E8E2D5] text-center space-y-2 font-sans">
            <span className="text-[10px] uppercase tracking-wider text-[#242522]/50 block font-mono">
              Acesso Rápido para Avaliação
            </span>
            <div className="flex flex-col sm:flex-row justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  loginAsDemoAdmin();
                  router.push("/admin");
                }}
                className="text-[11px] px-3 py-2 bg-[#242522] text-[#F5F1E9] hover:bg-[#87563B] uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C4A476]" />
                <span>Entrar como Administradora</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  loginAsDemoCustomer();
                  router.push("/minha-conta");
                }}
                className="text-[11px] px-3 py-2 bg-[#F5F1E9] border border-[#E8E2D5] text-[#242522] hover:border-[#87563B] uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-[#70775E]" />
                <span>Entrar como Cliente</span>
              </button>
            </div>
          </div>

          <div className="pt-2 text-center text-xs font-sans text-[#242522]/70">
            Ainda não tem conta?{" "}
            <Link href="/cadastro" className="text-[#87563B] font-semibold hover:underline">
              Cadastre-se
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
