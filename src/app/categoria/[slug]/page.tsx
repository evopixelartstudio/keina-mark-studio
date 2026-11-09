'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/store/ProductCard';
import { useStore } from '@/context/StoreContext';
import { ArrowLeft } from 'lucide-react';

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { categories, products } = useStore();

  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F1E9]">
        <Header />
        <main className="flex-1 flex items-center justify-center p-8 text-center">
          <div className="space-y-4 max-w-md">
            <h1 className="font-editorial text-3xl text-[#242522]">Categoria não encontrada</h1>
            <p className="text-sm text-[#242522]/70">
              A categoria solicitada não existe ou foi temporariamente desativada.
            </p>
            <Link
              href="/loja"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#87563B]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para a Loja</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryProducts = products.filter(
    (p) => p.category_id === category.id && p.status === 'published'
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1E9]">
      <Header />

      <main className="flex-1 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/loja"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#70775E] hover:text-[#242522] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Todas as Categorias</span>
            </Link>
          </div>

          {/* Editorial Category Header */}
          <div className="border-b border-[#E8E2D5] pb-10 mb-12">
            <span className="text-xs uppercase tracking-[0.3em] text-[#70775E] font-medium font-sans block mb-2">
              Universo Autoral
            </span>
            <h1 className="font-editorial text-4xl sm:text-6xl text-[#242522] font-light">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-base sm:text-lg text-[#242522]/80 font-light mt-3 max-w-2xl leading-relaxed">
                {category.description}
              </p>
            )}
          </div>

          {/* Grid of category products */}
          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {categoryProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={category.name}
                />
              ))}
            </div>
          ) : (
            <div className="bg-[#FAF7F2] p-12 text-center border border-[#E8E2D5] max-w-md mx-auto space-y-4">
              <p className="font-editorial text-2xl text-[#242522]">Nenhuma peça disponível no momento</p>
              <p className="text-xs text-[#242522]/70 leading-relaxed">
                Novas peças autorais desta categoria estão em fase de produção no ateliê.
              </p>
              <Link
                href="/loja"
                className="inline-block text-xs uppercase tracking-wider font-semibold text-[#87563B] border-b border-[#87563B] pb-0.5"
              >
                Ver Todas as Peças
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
