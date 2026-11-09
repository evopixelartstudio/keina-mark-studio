'use client';

import React from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useStore } from '@/context/StoreContext';
import { 
  Package, 
  Eye, 
  FileEdit, 
  AlertCircle, 
  Users, 
  FolderTree, 
  Plus, 
  ShieldCheck 
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { products, categories, shippingSettings } = useStore();

  const totalProducts = products.length;
  const publishedProducts = products.filter((p) => p.status === 'published').length;
  const draftProducts = products.filter((p) => p.status === 'draft').length;
  const priceOnRequestProducts = products.filter((p) => p.is_price_on_request || p.price === null).length;
  const lowStockProducts = products.filter((p) => p.track_stock && p.stock_quantity <= 2).length;

  const statCards = [
    {
      title: 'Total de Peças Cadastradas',
      value: totalProducts,
      desc: 'Catálogo geral no sistema',
      icon: Package,
      color: 'text-[#242522]',
      bg: 'bg-[#F5F1E9]',
    },
    {
      title: 'Peças Publicadas',
      value: publishedProducts,
      desc: 'Visíveis na loja virtual',
      icon: Eye,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Peças em Rascunho',
      value: draftProducts,
      desc: 'Aguardando validação/fotos',
      icon: FileEdit,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
    },
    {
      title: 'Peças Sob Consulta',
      value: priceOnRequestProducts,
      desc: 'Preço a ser definido pelo ateliê',
      icon: AlertCircle,
      color: 'text-[#87563B]',
      bg: 'bg-[#DEC9A9]/30',
    },
    {
      title: 'Estoque Baixo ou Crítico',
      value: lowStockProducts,
      desc: 'Com 2 ou menos unidades',
      icon: AlertCircle,
      color: 'text-red-700',
      bg: 'bg-red-50',
    },
    {
      title: 'Categorias Ativas',
      value: categories.filter((c) => c.is_active).length,
      desc: 'Universo editorial organizado',
      icon: FolderTree,
      color: 'text-[#70775E]',
      bg: 'bg-[#E8E2D5]/50',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D5] pb-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#70775E] font-medium font-mono">
              Visão Executiva &bull; Demonstração Autoral
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl text-[#242522]">
              Painel de Controle
            </h1>
            <p className="text-xs text-[#242522]/70 mt-1">
              Gerencie catálogo, imagens reais, categorias, frete e configurações da marca.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/produtos/novo"
              className="inline-flex items-center gap-2 bg-[#242522] text-[#F5F1E9] px-4 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-[#87563B] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Peça</span>
            </Link>
          </div>
        </div>

        {/* Real Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 border border-[#E8E2D5] flex items-start justify-between shadow-2xs"
              >
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-[#70775E] font-medium">
                    {stat.title}
                  </span>
                  <p className={`font-editorial text-3xl sm:text-4xl font-light ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-[#242522]/60 pt-1 font-mono">
                    {stat.desc}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-xs flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                  <Icon className="w-5 h-5 stroke-[1.5]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Operating Status Transparency Banner */}
        <div className="bg-[#FAF7F2] border-2 border-dashed border-[#C4A476] p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-[#87563B]">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-editorial text-xl text-[#242522]">
              Status Operacional da Loja
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#242522]/85">
            <div className="space-y-1 border-l-2 border-[#70775E] pl-3">
              <span className="font-semibold block text-[#70775E]">Catálogo & Fotografias</span>
              <p>12 peças reais catalogadas com imagens padronizadas e descrições provisórias.</p>
            </div>
            <div className="space-y-1 border-l-2 border-[#87563B] pl-3">
              <span className="font-semibold block text-[#87563B]">Cálculo de Frete</span>
              <p>
                Origem: {shippingSettings.origin_city}/{shippingSettings.origin_state}. Integração ViaCEP ativa; aguardando token de transportadora para cotações instantâneas.
              </p>
            </div>
            <div className="space-y-1 border-l-2 border-[#242522] pl-3">
              <span className="font-semibold block text-[#242522]">Checkout & Pagamento</span>
              <p>Desativado propositalmente nesta etapa conforme briefing (sem vendas fictícias).</p>
            </div>
          </div>
        </div>

        {/* Quick Links / Recent Products */}
        <div className="bg-white border border-[#E8E2D5] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-4">
            <h3 className="font-editorial text-xl text-[#242522]">
              Últimas Peças Catalogadas
            </h3>
            <Link
              href="/admin/produtos"
              className="text-xs uppercase tracking-wider font-semibold text-[#87563B] hover:text-[#242522]"
            >
              Ver Todas &rarr;
            </Link>
          </div>

          <div className="divide-y divide-[#E8E2D5] text-xs">
            {products.slice(0, 5).map((prod) => (
              <div key={prod.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#F0ECE4] border border-[#E8E2D5] relative overflow-hidden shrink-0">
                    <img
                      src={prod.images[0]?.url || '/placeholder.png'}
                      alt=""
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div>
                    <Link
                      href={`/admin/produtos/${prod.id}`}
                      className="font-medium text-[#242522] hover:text-[#87563B]"
                    >
                      {prod.name}
                    </Link>
                    <p className="text-[11px] text-[#70775E] font-mono">
                      SKU: {prod.sku || 'N/A'} &bull; {prod.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[11px] ${prod.is_price_on_request ? 'text-[#87563B] italic' : 'font-semibold text-[#242522]'}`}>
                    {prod.price ? `R$ ${prod.price.toFixed(2)}` : 'Sob consulta'}
                  </span>
                  <Link
                    href={`/admin/produtos/${prod.id}`}
                    className="text-[#87563B] hover:underline"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
