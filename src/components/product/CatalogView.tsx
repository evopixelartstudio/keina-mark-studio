'use client';

import React, { useState, useMemo } from 'react';
import { Product, Category } from '@/types';
import { ProductCard } from '@/components/store/ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface CatalogViewProps {
  initialProducts: Product[];
  categories: Category[];
  initialCategory?: string;
  initialQuery?: string;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  initialProducts,
  categories,
  initialCategory,
  initialQuery = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) {
        result = result.filter((p) => p.category_id === cat.id);
      }
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.short_description?.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
    }

    return result;
  }, [initialProducts, categories, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-8">
      {/* Filters Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#DEC9A9]/50 pb-6">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-sans transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-[#242522] text-[#F5F1E9]'
                : 'bg-[#FAF7F2] text-[#242522]/80 border border-[#DEC9A9]/60 hover:border-[#87563B]'
            }`}
          >
            Todos ({initialProducts.length})
          </button>
          {categories.map((cat) => {
            const count = initialProducts.filter((p) => p.category_id === cat.id).length;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 text-xs uppercase tracking-widest font-sans transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#242522] text-[#F5F1E9]'
                    : 'bg-[#FAF7F2] text-[#242522]/80 border border-[#DEC9A9]/60 hover:border-[#87563B]'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar no acervo..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-[#FAF7F2] border border-[#DEC9A9]/60 focus:border-[#87563B] focus:outline-none font-sans text-[#242522] placeholder:text-[#242522]/40"
            />
            <Search className="w-4 h-4 text-[#242522]/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#242522]/40 hover:text-[#242522]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Select */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-[#FAF7F2] border border-[#DEC9A9]/60 px-4 py-2 pr-8 text-xs font-sans text-[#242522] focus:border-[#87563B] focus:outline-none cursor-pointer"
            >
              <option value="featured">Destaques</option>
              <option value="name">Ordem alfabética (A-Z)</option>
              <option value="price-asc">Menor valor</option>
              <option value="price-desc">Maior valor</option>
            </select>
            <SlidersHorizontal className="w-3 h-3 text-[#242522]/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#242522]/60 font-sans">
        <span>
          Mostrando {filteredProducts.length} de {initialProducts.length} peças
        </span>
        {selectedCategory !== 'all' && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="text-[#87563B] hover:underline"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {filteredProducts.map((product) => {
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
      ) : (
        <div className="py-20 text-center space-y-4 bg-[#FAF7F2] border border-[#DEC9A9]/40 p-8">
          <p className="font-editorial text-2xl text-[#242522]">Nenhuma criação encontrada</p>
          <p className="text-sm text-[#242522]/60 font-sans max-w-md mx-auto">
            Não encontramos peças correspondentes aos filtros aplicados. Tente ajustar o termo de busca ou selecionar outra categoria.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 bg-[#87563B] text-white text-xs uppercase tracking-widest font-sans hover:bg-[#242522] transition-colors"
          >
            Ver Todas as Peças
          </button>
        </div>
      )}
    </div>
  );
};
