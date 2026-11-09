'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1E9]">
      <Header />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#70775E] hover:text-[#242522] mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao Início</span>
            </Link>
            <span className="text-xs uppercase tracking-[0.3em] text-[#70775E] font-medium font-sans block mb-2">
              Segurança & LGPD
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl text-[#242522]">
              Política de Privacidade
            </h1>
          </div>

          <div className="space-y-6 text-sm text-[#242522]/85 font-light leading-relaxed">
            <p>
              O <strong>Keina Mark Studio</strong> valoriza a transparência, privacidade e proteção dos dados pessoais de seus clientes e visitantes, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
            </p>

            <section className="space-y-2">
              <h2 className="font-editorial text-2xl text-[#242522]">1. Coleta de Dados</h2>
              <p>
                Coletamos apenas os dados essenciais para identificação cadastral, comunicação e cálculo de rotas de entrega: nome, e-mail e endereços cadastrados.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-editorial text-2xl text-[#242522]">2. Utilização das Informações</h2>
              <p>
                Os dados fornecidos não são vendidos, alugados ou compartilhados com terceiros com finalidades publicitárias. São utilizados exclusivamente para a prestação de serviços logísticos e de atendimento.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-editorial text-2xl text-[#242522]">3. Direitos do Titular</h2>
              <p>
                O titular pode a qualquer momento solicitar acesso, retificação ou exclusão de seus dados pessoais entrando em contato através do nosso canal direto.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
