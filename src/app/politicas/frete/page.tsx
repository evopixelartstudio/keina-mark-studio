'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Truck, ArrowLeft, AlertCircle } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function ShippingPolicyPage() {
  const { shippingSettings } = useStore();

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
              Diretrizes de Envio
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl text-[#242522]">
              Política de Frete & Expedição
            </h1>
          </div>

          <div className="bg-[#FAF7F2] p-6 border border-[#E8E2D5] space-y-4 text-xs">
            <div className="flex items-center gap-2 text-[#87563B] font-semibold uppercase tracking-wider">
              <Truck className="w-4 h-4" />
              <span>Origem das Remessas</span>
            </div>
            <p className="text-[#242522]/80 leading-relaxed">
              Todos os pedidos do Keina Mark Studio são expedidos a partir de{' '}
              <strong>{shippingSettings.origin_city} - {shippingSettings.origin_state}</strong> (CEP:{' '}
              {shippingSettings.origin_postal_code}).
            </p>
          </div>

          <div className="space-y-8 text-sm text-[#242522]/85 font-light leading-relaxed">
            <section className="space-y-3">
              <h2 className="font-editorial text-2xl text-[#242522]">1. Modalidades de Envio</h2>
              <p>
                Trabalhamos com envio para todo o território nacional. Para peças de vestuário e acessórios leves, utilizamos serviços expressos e econômicos convencionais. Para peças volumosas (mobiliário e esculturas de parede), o envio é realizado por transportadoras especializadas com proteção antiqueda.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-editorial text-2xl text-[#242522]">2. Prazos de Produção e Postagem</h2>
              <p>
                Peças identificadas como <strong>Sob Encomenda</strong> necessitam de período de confecção autoral informado na página do produto antes da postagem. Peças em pronta entrega são despachadas em até 3 dias úteis após a confirmação do pedido.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-editorial text-2xl text-[#242522]">3. Rastreamento</h2>
              <p>
                Assim que a remessa é coletada pela transportadora, o código de rastreamento é disponibilizado para acompanhamento em tempo real.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-editorial text-2xl text-[#242522]">4. Mobiliário e Peças de Grande Volume</h2>
              <div className="p-4 bg-[#F5F1E9] border border-[#DEC9A9] flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#87563B] shrink-0 mt-0.5" />
                <p className="text-xs text-[#242522]/80">
                  Cadeiras e peças estruturais de madeira maciça exigem manuseio cuidadoso e embalagens de madeira ou cantoneiras reforçadas. A entrega é realizada no piso térreo em caso de edifícios sem elevador de carga compatível.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
