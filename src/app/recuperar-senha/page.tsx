"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-marfim text-grafite">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-marfim-50 border border-grafite/10 p-8 sm:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-sans uppercase tracking-[0.25em] text-couro font-medium block">
              Segurança
            </span>
            <h1 className="font-serif text-3xl font-light text-grafite">
              Recuperar Senha
            </h1>
            <p className="text-xs text-grafite/60 font-sans">
              Informe seu e-mail cadastrado para receber instruções de redefinição de acesso.
            </p>
          </div>

          {sent ? (
            <div className="p-4 bg-marfim border border-oliva/30 text-center space-y-3">
              <CheckCircle2 className="w-6 h-6 text-oliva mx-auto" />
              <p className="text-xs font-sans text-grafite font-medium">
                Instruções enviadas com sucesso para <strong>{email}</strong>.
              </p>
              <p className="text-[11px] font-sans text-grafite/60">
                Verifique sua caixa de entrada e pasta de spam.
              </p>
              <Link
                href="/entrar"
                className="inline-block mt-2 text-xs uppercase tracking-wider text-couro hover:underline font-semibold"
              >
                Voltar ao login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-sans uppercase tracking-wider text-grafite/70 block">
                  E-mail Cadastrado
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-grafite/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-marfim border border-grafite/20 rounded-none focus:outline-hidden focus:border-couro font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-grafite text-marfim text-xs font-sans font-semibold uppercase tracking-[0.2em] hover:bg-couro disabled:opacity-50 transition-colors mt-2"
              >
                {loading ? "Processando..." : "Enviar link de recuperação"}
              </button>
            </form>
          )}

          <div className="pt-2 text-center text-xs font-sans text-grafite/60 border-t border-grafite/10">
            <Link
              href="/entrar"
              className="text-couro font-medium hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar para o login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
