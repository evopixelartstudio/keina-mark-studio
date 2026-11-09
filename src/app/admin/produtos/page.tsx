'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useStore } from '@/context/StoreContext';
import { ProductStatus } from '@/types';
import { 
  Plus, 
  Search, 
  Copy, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Package, 
  ExternalLink 
} from 'lucide-react';

export default function AdminProductsPage() {
  const { products, categories, deleteProduct, duplicateProduct, setProductStatus } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category filter
      if (selectedCategory !== 'all' && prod.category_id !== selectedCategory) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && prod.status !== selectedStatus) {
        return false;
      }
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(q);
        const matchesSku = prod.sku?.toLowerCase().includes(q);
        if (!matchesName && !matchesSku) return false;
      }
      return true;
    });
  }, [products, search, selectedCategory, selectedStatus]);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir a peça "${name}"? Esta ação removerá o produto do catálogo.`)) {
      deleteProduct(id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D5] pb-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#70775E] font-medium font-mono">
              Catálogo & Acervo
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl text-[#242522]">
              Gerenciamento de Produtos
            </h1>
            <p className="text-xs text-[#242522]/70 mt-1">
              Cadastre, edite, publique ou organize as peças da loja com total autonomia.
            </p>
          </div>

          <Link
            href="/admin/produtos/novo"
            className="inline-flex items-center gap-2 bg-[#242522] text-[#F5F1E9] px-4 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-[#87563B] transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Nova Peça</span>
          </Link>
        </div>

        {/* Toolbar: Search & Filters */}
        <div className="bg-white p-4 border border-[#E8E2D5] flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#6C6F65] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou SKU..."
              className="w-full bg-[#FAF7F2] border border-[#E8E2D5] pl-9 pr-3 py-2 text-xs text-[#242522] focus:outline-none focus:border-[#87563B]"
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#FAF7F2] border border-[#E8E2D5] px-3 py-2 text-xs text-[#242522] focus:outline-none"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#FAF7F2] border border-[#E8E2D5] px-3 py-2 text-xs text-[#242522] focus:outline-none"
            >
              <option value="all">Todos os Status</option>
              <option value="published">Publicados</option>
              <option value="draft">Rascunhos</option>
              <option value="archived">Arquivados</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white border border-[#E8E2D5] shadow-2xs overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F1E9] border-b border-[#E8E2D5] text-[#70775E] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Peça / Identificação</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Preço</th>
                <th className="py-3 px-4">Estoque</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D5]">
              {filteredProducts.map((product) => {
                const cat = categories.find((c) => c.id === product.category_id);
                const primaryImg = product.images[0]?.url || '/placeholder.png';

                return (
                  <tr key={product.id} className="hover:bg-[#FAF7F2] transition-colors">
                    {/* Image & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 bg-[#F0ECE4] border border-[#E8E2D5] relative overflow-hidden shrink-0">
                          <img
                            src={primaryImg}
                            alt=""
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <Link
                            href={`/admin/produtos/${product.id}`}
                            className="font-semibold text-sm text-[#242522] hover:text-[#87563B]"
                          >
                            {product.name}
                          </Link>
                          <div className="flex items-center gap-2 text-[11px] text-[#70775E] font-mono">
                            <span>SKU: {product.sku || 'Sem SKU'}</span>
                            {product.is_bulky && (
                              <span className="text-[#87563B] font-sans font-medium bg-[#DEC9A9]/40 px-1.5 py-0.2">
                                Mobiliário
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-[#242522]">
                      {cat?.name || 'Não atribuída'}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      {product.price !== null && product.price !== undefined && !product.is_price_on_request ? (
                        <span className="font-medium text-[#242522]">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                        </span>
                      ) : (
                        <span className="text-[#87563B] italic">Sob consulta</span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4">
                      {product.track_stock ? (
                        <span className={product.stock_quantity <= 2 ? 'text-red-700 font-semibold' : 'text-[#242522]'}>
                          {product.stock_quantity} un.
                        </span>
                      ) : (
                        <span className="text-[#70775E]">Livre / Encomenda</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${
                          product.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : product.status === 'draft'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        {product.status === 'published' ? 'Publicado' : product.status === 'draft' ? 'Rascunho' : 'Arquivado'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {/* Status switcher */}
                        {product.status === 'published' ? (
                          <button
                            type="button"
                            onClick={() => setProductStatus(product.id, 'draft')}
                            title="Despublicar (Mudar para Rascunho)"
                            className="p-1.5 text-[#6C6F65] hover:text-[#242522]"
                          >
                            <EyeOff className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setProductStatus(product.id, 'published')}
                            title="Publicar na loja"
                            className="p-1.5 text-emerald-600 hover:text-emerald-800"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}

                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={() => duplicateProduct(product.id)}
                          title="Duplicar peça"
                          className="p-1.5 text-[#6C6F65] hover:text-[#87563B]"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <Link
                          href={`/admin/produtos/${product.id}`}
                          title="Editar peça"
                          className="p-1.5 text-[#87563B] hover:text-[#242522]"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>

                        {/* View in store */}
                        <Link
                          href={`/produto/${product.slug}`}
                          target="_blank"
                          title="Ver na loja"
                          className="p-1.5 text-[#70775E] hover:text-[#242522]"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id, product.name)}
                          title="Excluir peça"
                          className="p-1.5 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="p-12 text-center text-[#70775E] space-y-2">
              <Package className="w-8 h-8 mx-auto opacity-50" />
              <p>Nenhuma peça encontrada com os filtros informados.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
