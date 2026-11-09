'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
              Condições de Uso
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl text-[#242522]">
              Termos de Uso
            </h1>
          </div>

          <div className="space-y-6 text-sm text-[#242522]/85 font-light leading-relaxed">
            <p>
              Bem-vindo ao portal do <strong>Keina Mark Studio</strong>. Ao navegar e utilizar este website, você concorda com os seguintes termos e condições gerais.
            </p>

            <section className="space-y-2">
              <h2 className="font-editorial text-2xl text-[#242522]">1. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo deste site, incluindo fotografias reais de produtos, logotipos, elementos gráficos, textos editoriais e desenhos industriais das peças, são de propriedade exclusiva do Keina Mark Studio. É proibida qualquer reprodução ou uso comercial não autorizado.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-editorial text-2xl text-[#242522]">2. Informações e Catálogo Autoral</h2>
              <p>
                O catálogo inicial reflete a produção do ateliê. Peças feitas à mão em madeira maciça ou fibras naturais apresentam variações orgânicas em veios, texturas e tonalidades, características intrínsecas da matéria viva e do artesanato contemporâneo.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-editorial text-2xl text-[#242522]">3. Encomendas Sob Medida</h2>
              <p>
                Peças sob encomenda têm seus prazos e condições pactuados diretamente com o cliente no momento da solicitação de orçamento.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
