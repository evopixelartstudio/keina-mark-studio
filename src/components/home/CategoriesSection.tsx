'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';
import { ArrowRight } from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/initial-data';

interface CategoriesSectionProps {
  categories?: Category[];
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories }) => {
  const list = (categories && categories.length > 0 ? categories : INITIAL_CATEGORIES)
    .filter((c) => c.is_active)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <section className="py-20 lg:py-28 bg-[#F5F1E9] border-b border-[#E8E2D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#87563B]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#70775E] font-medium font-sans">
                Categorias Autorais
              </span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl text-[#242522] font-light">
              Explorar por Universo
            </h2>
          </div>
          <p className="text-sm text-[#242522]/70 max-w-md font-light leading-relaxed font-sans">
            Peças selecionadas que transitam entre a presença escultural do mobiliário, o conforto da moda e a singularidade dos objetos cotidianos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {list.map((category) => (
            <Link
              key={category.id}
              href={`/categoria/${category.slug}`}
              className="group relative flex flex-col bg-[#FAF7F2] border border-[#E8E2D5] hover:border-[#87563B] transition-all duration-300 overflow-hidden"
            >
              <div className="relative aspect-4/5 w-full bg-[#F0ECE4] overflow-hidden">
                {category.image_url ? (
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain p-6 group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#70775E]">
                    Sem imagem
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#242522]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6 flex flex-col justify-between flex-1 gap-4">
                <div>
                  <h3 className="font-editorial text-2xl text-[#242522] group-hover:text-[#87563B] transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs text-[#242522]/70 mt-1.5 line-clamp-2 leading-relaxed font-sans">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center text-xs font-semibold uppercase tracking-widest text-[#87563B] group-hover:text-[#242522] transition-colors pt-2 border-t border-[#E8E2D5]/60 font-sans">
                  <span>Ver Coleção</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
