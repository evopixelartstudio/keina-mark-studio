'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from './ProductCard';
import { ArrowRight } from 'lucide-react';

export const FeaturedCollection: React.FC = () => {
  const { collections, products, categories } = useStore();
  const primaryCollection = collections.find((c) => c.is_active) || collections[0];

  if (!primaryCollection) return null;

  // Filter products for this collection or featured products
  const featuredProducts = products.filter((p) => p.is_featured && p.status === 'published').slice(0, 4);

  return (
    <section className="py-20 lg:py-28 bg-[#F5F1E9] border-b border-[#E8E2D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#87563B]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#70775E] font-medium font-sans">
                Coleção Editorial
              </span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl text-[#242522] font-light">
              {primaryCollection.name}
            </h2>
            {primaryCollection.subtitle && (
              <p className="text-sm sm:text-base text-[#242522]/75 font-light mt-2 max-w-xl">
                {primaryCollection.subtitle}
              </p>
            )}
          </div>

          <Link
            href="/loja"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#87563B] hover:text-[#242522] transition-colors"
          >
            <span>Ver Toda a Coleção</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featuredProducts.map((product) => {
            const cat = categories.find((c) => c.id === product.category_id);
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
