'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  categoryName?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, categoryName }) => {
  const primaryImage = product.images.find((img) => img.is_primary)?.url || product.images[0]?.url || '/placeholder.png';
  const displayPrice = product.price !== null && product.price !== undefined && !product.is_price_on_request
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)
    : 'Preço sob consulta';

  return (
    <article className="group flex flex-col h-full bg-[#FAF7F2] border border-[#E8E2D5]/70 hover:border-[#DEC9A9] transition-all duration-300">
      {/* Image container */}
      <Link
        href={`/produto/${product.slug}`}
        className="relative block aspect-4/5 overflow-hidden bg-[#F0ECE4]"
      >
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out"
          priority={false}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.is_made_to_order && (
            <span className="bg-[#87563B] text-white text-[10px] tracking-widest uppercase font-semibold px-2 py-0.5 rounded-none shadow-xs">
              Sob encomenda
            </span>
          )}
          {product.is_bulky && (
            <span className="bg-[#70775E] text-white text-[10px] tracking-widest uppercase font-semibold px-2 py-0.5 rounded-none shadow-xs">
              Mobiliário
            </span>
          )}
          {product.status === 'draft' && (
            <span className="bg-[#242522] text-[#DEC9A9] text-[10px] tracking-widest uppercase font-mono px-2 py-0.5 rounded-none shadow-xs">
              Rascunho
            </span>
          )}
        </div>

        {/* Quick View hover action */}
        <div className="absolute inset-0 bg-[#242522]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
          <span className="w-10 h-10 rounded-full bg-[#FAF7F2] text-[#242522] flex items-center justify-center shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <ArrowUpRight className="w-5 h-5 stroke-[1.5]" />
          </span>
        </div>
      </Link>

      {/* Product metadata */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {categoryName && (
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#70775E] font-medium block mb-1">
              {categoryName}
            </span>
          )}
          <h3 className="font-editorial text-lg sm:text-xl text-[#242522] group-hover:text-[#87563B] transition-colors line-clamp-2 leading-snug">
            <Link href={`/produto/${product.slug}`}>
              {product.name}
            </Link>
          </h3>
        </div>

        <div className="pt-2 border-t border-[#E8E2D5]/50 flex items-center justify-between">
          <span className={`text-sm ${product.is_price_on_request ? 'text-[#87563B] font-medium italic' : 'text-[#242522] font-semibold'}`}>
            {displayPrice}
          </span>
          <span className="text-[11px] text-[#70775E] tracking-wider uppercase">
            Ver detalhes
          </span>
        </div>
      </div>
    </article>
  );
};
