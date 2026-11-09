'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export const EditorialHero: React.FC = () => {
  const { appearanceSettings } = useStore();

  return (
    <section className="relative overflow-hidden bg-[#242522] min-h-[85vh] flex items-center border-b border-[#DEC9A9]/30">
      {/* Imagem de Fundo 100% Sangrada até a borda */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <Image
          src="/Hero.png"
          alt="Keina Mark Studio — Curadoria Oficial da Coleção"
          fill
          className="object-cover object-center brightness-[0.88]"
          priority
        />
        {/* Overlay editorial direcional para leitura cristalina */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#181917]/90 via-[#181917]/70 to-[#181917]/25" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20 lg:py-28">
        <div className="max-w-2xl space-y-8 text-left">
          <div className="inline-flex items-center gap-3">
            <span className="h-px w-8 bg-[#C4A476]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#C4A476] font-semibold font-sans">
              Coleção Inaugural &middot; Curadoria Exclusiva
            </span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-light text-[#FFFFFF] leading-[1.05] tracking-tight whitespace-pre-line drop-shadow-md">
            {appearanceSettings.hero_title || 'Design com origem.\nPeças com identidade.'}
          </h1>

          <p className="text-base sm:text-lg text-[#F5F1E9] font-light max-w-xl leading-relaxed opacity-90 drop-shadow-sm">
            {appearanceSettings.hero_subtitle || 'Uma curadoria de peças que une criatividade, expressão e design contemporâneo.'}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="/loja"
              className="group inline-flex items-center gap-3 bg-[#F5F1E9] text-[#242522] px-9 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#87563B] hover:text-[#FFFFFF] transition-all duration-300 shadow-lg"
            >
              <span>{appearanceSettings.hero_cta || 'Explorar Coleção'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/sobre"
              className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.2em] text-[#F5F1E9] border border-[#F5F1E9]/40 bg-[#F5F1E9]/10 backdrop-blur-sm hover:bg-[#F5F1E9] hover:text-[#242522] px-8 py-4 transition-all duration-300"
            >
              Conhecer o Studio
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-[#F5F1E9]/20 max-w-lg">
            <div>
              <span className="block text-[11px] text-[#C4A476] uppercase tracking-wider font-semibold">Origem</span>
              <span className="font-editorial text-xl sm:text-2xl text-[#FFFFFF]">Manaus / AM</span>
            </div>
            <div>
              <span className="block text-[11px] text-[#C4A476] uppercase tracking-wider font-semibold">Identidade</span>
              <span className="font-editorial text-xl sm:text-2xl text-[#FFFFFF]">100% Autoral</span>
            </div>
            <div>
              <span className="block text-[11px] text-[#C4A476] uppercase tracking-wider font-semibold">Acervo</span>
              <span className="font-editorial text-xl sm:text-2xl text-[#FFFFFF]">12 Peças</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
