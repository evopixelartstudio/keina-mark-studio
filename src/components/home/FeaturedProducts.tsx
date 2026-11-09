'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { ProductCard } from '@/components/store/ProductCard';
import { ArrowRight } from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/initial-data';

interface FeaturedProductsProps {
  products?: Product[];
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  const allProducts = products && products.length > 0 ? products : INITIAL_PRODUCTS;
  const featured = allProducts
    .filter((p) => (p.is_featured || p.status === 'published'))
    .slice(0, 8);

  return (
    <section className="py-20 lg:py-28 bg-[#FAF7F2] border-b border-[#E8E2D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#87563B]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#70775E] font-medium font-sans">
                Curadoria em Destaque
              </span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl text-[#242522] font-light">
              Criações Autorais
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-sm text-[#242522]/70 max-w-md font-light leading-relaxed font-sans">
              Peças desenvolvidas com matérias-primas nobres, tiragem reduzida e atenção aos mínimos acabamentos.
            </p>
            <Link
              href="/loja"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#87563B] hover:text-[#242522] transition-colors whitespace-nowrap font-sans"
            >
              <span>Ver Catálogo Completo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featured.map((product) => {
            const cat = INITIAL_CATEGORIES.find((c) => c.id === product.category_id);
            return (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={cat?.name}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
