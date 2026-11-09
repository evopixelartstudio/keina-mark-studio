'use client';

import React from 'react';
import Link from 'next/link';
import { Collection, Product } from '@/types';
import { ProductCard } from '@/components/store/ProductCard';
import { ArrowRight } from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/initial-data';

interface CuratedCollectionProps {
  collection: Collection;
  products?: Product[];
}

export const CuratedCollection: React.FC<CuratedCollectionProps> = ({ collection, products = [] }) => {
  if (!collection) return null;

  // Filter products for this collection or featured products
  const displayProducts = products.length > 0
    ? products.filter((p) => (collection.product_ids?.includes(p.id) || p.is_featured)).slice(0, 4)
    : [];

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
              {collection.title || collection.name}
            </h2>
            {collection.subtitle && (
              <p className="text-sm sm:text-base text-[#242522]/75 font-light mt-2 max-w-xl font-sans">
                {collection.subtitle}
              </p>
            )}
          </div>

          <Link
            href="/loja"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#87563B] hover:text-[#242522] transition-colors font-sans"
          >
            <span>Ver Toda a Coleção</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {displayProducts.map((product) => {
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
