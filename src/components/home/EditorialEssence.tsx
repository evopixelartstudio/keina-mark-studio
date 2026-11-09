'use client';

import React from 'react';
import Image from 'next/image';
import { Compass, Feather, Sparkles } from 'lucide-react';
import { INITIAL_APPEARANCE_SETTINGS } from '@/lib/initial-data';

export const EditorialEssence: React.FC = () => {
  return (
    <section className="py-24 lg:py-32 bg-[#FAF7F2] border-b border-[#E8E2D5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual framing */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-4/5 bg-[#F0ECE4] border border-[#DEC9A9] shadow-lg overflow-hidden">
              <Image
                src="/products/painel-madeira-metal-geometrico.png"
                alt="Painel escultural em madeira e metal Keina Mark Studio"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-contain p-6 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#F5F1E9]/90 backdrop-blur-xs p-4 border border-[#E8E2D5]">
                <p className="font-editorial text-sm text-[#242522]">Encontro de Matérias</p>
                <p className="text-[11px] text-[#70775E] uppercase tracking-wider font-mono">
                  Madeira de origem &bull; Metal estruturado &bull; Geometria
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial story */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#70775E]" />
                <span className="text-xs uppercase tracking-[0.3em] text-[#70775E] font-medium font-sans">
                  Manifesto Autoral
                </span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl text-[#242522] font-light leading-[1.15]">
                {INITIAL_APPEARANCE_SETTINGS.essence_title || 'A essência da Keina Mark Studio'}
              </h2>
            </div>

            <div className="space-y-6 text-[#242522]/85 text-base sm:text-lg font-light leading-relaxed font-sans">
              <p>
                {INITIAL_APPEARANCE_SETTINGS.essence_p1 ||
                  'Criada sob a inspiração de formas naturais, texturas vivas e a sofisticação da identidade amazônica, a Keina Mark Studio transcende tendências passageiras.'}
              </p>
              <p>
                {INITIAL_APPEARANCE_SETTINGS.essence_p2 ||
                  'Cada objeto, peça de vestuário e mobiliário carrega uma narrativa própria — unindo o trabalho manual com a precisão do design contemporâneo.'}
              </p>
            </div>

            {/* Core Values Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#E8E2D5]">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#E8E2D5] flex items-center justify-center text-[#87563B]">
                  <Compass className="w-4 h-4 stroke-[1.5]" />
                </div>
                <h4 className="font-editorial text-lg text-[#242522]">Origem &amp; Raiz</h4>
                <p className="text-xs text-[#242522]/70 leading-normal font-sans">
                  Inspiração na bioma amazônico interpretado com sobriedade e geometria moderna.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#E8E2D5] flex items-center justify-center text-[#87563B]">
                  <Feather className="w-4 h-4 stroke-[1.5]" />
                </div>
                <h4 className="font-editorial text-lg text-[#242522]">Tato &amp; Matéria</h4>
                <p className="text-xs text-[#242522]/70 leading-normal font-sans">
                  Madeiras nobres, couros, tecidos estruturados e metais escovados em harmonia.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#E8E2D5] flex items-center justify-center text-[#87563B]">
                  <Sparkles className="w-4 h-4 stroke-[1.5]" />
                </div>
                <h4 className="font-editorial text-lg text-[#242522]">Exclusividade</h4>
                <p className="text-xs text-[#242522]/70 leading-normal font-sans">
                  Tiragens pensadas para colecionadores e amantes de composições singulares.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
