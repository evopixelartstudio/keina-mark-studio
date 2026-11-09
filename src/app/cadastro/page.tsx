"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/lib/auth-context";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (password !== confirmPassword) {
      setError("A confirmação de senha não confere.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve possuir ao menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signIn(email, "customer");
      router.push("/minha-conta");
    } catch {
      setError("Não foi possível criar a conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-marfim text-grafite">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-marfim-50 border border-grafite/10 p-8 sm:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-sans uppercase tracking-[0.25em] text-couro font-medium block">
              Novo Cliente
            </span>
            <h1 className="font-serif text-3xl font-light text-grafite">
              Criar Conta
            </h1>
            <p className="text-xs text-grafite/60 font-sans">
              Cadastre-se de forma simples para salvar seus endereços e preferências.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800 font-sans">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-sans uppercase tracking-wider text-grafite/70 block">
                  Nome
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-grafite/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Nome"
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-marfim border border-grafite/20 rounded-none focus:outline-hidden focus:border-couro font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-sans uppercase tracking-wider text-grafite/70 block">
                  Sobrenome
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Sobrenome"
                  required
                  className="w-full px-3 py-2.5 text-xs bg-marfim border border-grafite/20 rounded-none focus:outline-hidden focus:border-couro font-sans"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-sans uppercase tracking-wider text-grafite/70 block">
                E-mail
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

            <div className="space-y-1.5">
              <label className="text-xs font-sans uppercase tracking-wider text-grafite/70 block">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-grafite/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-marfim border border-grafite/20 rounded-none focus:outline-hidden focus:border-couro font-sans"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-sans uppercase tracking-wider text-grafite/70 block">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-grafite/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita sua senha"
                  required
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-marfim border border-grafite/20 rounded-none focus:outline-hidden focus:border-couro font-sans"
                />
              </div>
            </div>

            <p className="text-[11px] text-grafite/50 font-sans leading-relaxed">
              Ao criar a conta, você concorda com os{" "}
              <Link href="/termos-de-uso" className="text-couro hover:underline">
                Termos de Uso
              </Link>{" "}
              e a{" "}
              <Link href="/politica-de-privacidade" className="text-couro hover:underline">
                Política de Privacidade
              </Link>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-grafite text-marfim text-xs font-sans font-semibold uppercase tracking-[0.2em] hover:bg-couro disabled:opacity-50 transition-colors mt-2"
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>

          <div className="pt-2 text-center text-xs font-sans text-grafite/60 border-t border-grafite/10">
            Já possui cadastro?{" "}
            <Link href="/entrar" className="text-couro font-medium hover:underline">
              Entrar
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
