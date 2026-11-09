'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useStore } from '@/context/StoreContext';
import { 
  Trash2, 
  ArrowLeft, 
  ShoppingBag, 
  Truck, 
  Info, 
  Lock
} from 'lucide-react';

export default function CartPage() {
  const { 
    cart, 
    cartSubtotal, 
    cartTotalCount, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    calculateFreight,
    shippingSettings 
  } = useStore();

  const [cep, setCep] = useState('');
  const [freightLoading, setFreightLoading] = useState(false);
  const [freightResult, setFreightResult] = useState<any>(null);

  const handleFreightCalc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cep.trim()) return;
    setFreightLoading(true);
    try {
      const res = await calculateFreight(cep);
      setFreightResult(res);
    } finally {
      setFreightLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1E9]">
      <Header />

      <main className="flex-1 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="border-b border-[#E8E2D5] pb-6 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#70775E] font-medium block mb-1">
                Sua Seleção
              </span>
              <h1 className="font-editorial text-4xl sm:text-5xl text-[#242522] font-light">
                Sacola de Compras
              </h1>
            </div>

            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-[#87563B] hover:text-[#242522] uppercase tracking-wider font-medium self-start sm:self-auto"
              >
                Esvaziar Sacola
              </button>
            )}
          </div>

          {cart.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Items List */}
              <div className="lg:col-span-7 space-y-6">
                <div className="divide-y divide-[#E8E2D5] border-t border-b border-[#E8E2D5]">
                  {cart.map((item) => {
                    const primaryImg = item.product.images[0]?.url || '/placeholder.png';
                    const unitPrice = item.variant?.price ?? item.product.promotional_price ?? item.product.price ?? 0;
                    const itemTotal = unitPrice * item.quantity;

                    return (
                      <div key={item.id} className="py-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        {/* Thumbnail */}
                        <div className="relative w-24 h-28 bg-[#F0ECE4] border border-[#E8E2D5] shrink-0 overflow-hidden">
                          <Image
                            src={primaryImg}
                            alt={item.product.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-1">
                          <h3 className="font-editorial text-xl text-[#242522]">
                            <Link href={`/produto/${item.product.slug}`} className="hover:text-[#87563B]">
                              {item.product.name}
                            </Link>
                          </h3>
                          {item.variant && (
                            <p className="text-xs text-[#70775E]">
                              Variação: {item.variant.name}
                            </p>
                          )}
                          <p className="text-xs text-[#242522]/80 font-medium">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(unitPrice)} unid.
                          </p>
                          {item.product.is_bulky && (
                            <span className="inline-block text-[10px] text-[#87563B] bg-[#DEC9A9]/30 px-2 py-0.5 mt-1 font-medium">
                              Peça Volumosa / Mobiliário
                            </span>
                          )}
                        </div>

                        {/* Quantity and Controls */}
                        <div className="flex items-center gap-4 self-end sm:self-center">
                          <div className="flex items-center border border-[#E8E2D5] bg-[#FAF7F2]">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="px-2.5 py-1 text-sm text-[#242522] hover:bg-[#E8E2D5]"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-xs font-semibold text-[#242522]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="px-2.5 py-1 text-sm text-[#242522] hover:bg-[#E8E2D5]"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right min-w-[90px]">
                            <p className="text-sm font-semibold text-[#242522]">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(itemTotal)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-[#6C6F65] hover:text-[#87563B] transition-colors"
                            aria-label="Remover item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4">
                  <Link
                    href="/loja"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#87563B] hover:text-[#242522]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Continuar Explorando Peças</span>
                  </Link>
                </div>
              </div>

              {/* Order Summary & Shipping & Checkout Status */}
              <div className="lg:col-span-5 bg-[#FAF7F2] p-6 sm:p-8 border border-[#E8E2D5] space-y-6">
                <h2 className="font-editorial text-2xl text-[#242522] border-b border-[#E8E2D5] pb-4">
                  Resumo do Pedido
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-[#242522]/80">
                    <span>Subtotal ({cartTotalCount} {cartTotalCount === 1 ? 'item' : 'itens'})</span>
                    <span className="font-medium text-[#242522]">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cartSubtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#242522]/80 items-baseline">
                    <span>Estimativa de Frete</span>
                    <span className="text-xs text-[#70775E] italic">
                      {freightResult ? 'Calculado abaixo' : 'Informe o CEP'}
                    </span>
                  </div>

                  <div className="border-t border-[#E8E2D5] pt-3 flex justify-between text-base font-semibold text-[#242522]">
                    <span>Total Estimado</span>
                    <span className="text-xl">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cartSubtotal)}
                    </span>
                  </div>
                </div>

                {/* Freight calculation section in cart */}
                <div className="pt-4 border-t border-[#E8E2D5] space-y-3">
                  <label className="block text-xs uppercase tracking-wider text-[#70775E] font-semibold flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5" />
                    Calcular Frete e Prazos
                  </label>

                  <form onSubmit={handleFreightCalc} className="flex gap-2">
                    <input
                      type="text"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      placeholder="00000-000"
                      maxLength={9}
                      className="flex-1 bg-[#F5F1E9] border border-[#E8E2D5] px-3 py-2 text-xs text-[#242522] focus:outline-none focus:border-[#87563B]"
                    />
                    <button
                      type="submit"
                      disabled={freightLoading}
                      className="bg-[#242522] text-[#F5F1E9] px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-[#87563B] transition-colors disabled:opacity-50"
                    >
                      {freightLoading ? '...' : 'Calcular'}
                    </button>
                  </form>

                  {freightResult && (
                    <div className="p-3 bg-[#F5F1E9] border border-[#E8E2D5] text-xs space-y-2 animate-in fade-in">
                      <p className="text-[#242522] font-medium">{freightResult.notes}</p>
                      {freightResult.hasBulkyItem && (
                        <div className="p-2 bg-[#DEC9A9]/40 border border-[#C4A476] text-[#87563B] text-[11px] leading-tight">
                          <strong>Atenção:</strong> Sua sacola contém peças de grande porte (cadeira/mobiliário) que necessitam de transporte especial com proteção reforçada.
                        </div>
                      )}
                      {freightResult.options?.map((opt: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between border-t border-[#E8E2D5] pt-1 text-[11px]">
                          <span>{opt.name}</span>
                          <span className="text-[#70775E] italic">{opt.message}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mandatory Disclaimer: Payment offline / Em breve */}
                <div className="pt-4 border-t border-[#E8E2D5] space-y-4">
                  <div className="bg-[#FAF7F2] border-2 border-dashed border-[#C4A476] p-4 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-[#87563B] font-semibold uppercase tracking-wider">
                      <Info className="w-4 h-4 shrink-0" />
                      <span>Fase Demonstrativa Inaugural</span>
                    </div>
                    <p className="text-[#242522]/80 leading-relaxed">
                      Nesta etapa, o processamento de pagamentos online ainda não está ativado. O carrinho está plenamente funcional para seleção e cotação de peças.
                    </p>
                  </div>

                  {/* Disabled Checkout Button as instructed */}
                  <button
                    type="button"
                    disabled
                    className="w-full bg-[#E8E2D5] text-[#6C6F65] py-4 px-6 text-xs uppercase tracking-[0.2em] font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Finalização de Pedido (Em Breve)</span>
                  </button>

                  <a
                    href="mailto:contato@keinamarkstudio.com?subject=Interesse%20em%20finalizar%20pedido%20Keina%20Mark%20Studio"
                    className="block text-center text-xs text-[#87563B] hover:underline uppercase tracking-wider font-semibold pt-1"
                  >
                    Deseja encomendar agora? Fale diretamente com o Ateliê &rarr;
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#FAF7F2] p-16 text-center border border-[#E8E2D5] max-w-lg mx-auto space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#E8E2D5] flex items-center justify-center mx-auto text-[#87563B]">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div className="space-y-2">
                <h2 className="font-editorial text-3xl text-[#242522]">Sua sacola está vazia</h2>
                <p className="text-sm text-[#242522]/75 font-light leading-relaxed">
                  Descubra peças de vestuário, objetos contemporâneos e mobiliário com identidade na nossa curadoria.
                </p>
              </div>
              <div>
                <Link
                  href="/loja"
                  className="inline-block bg-[#242522] text-[#F5F1E9] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#87563B] transition-colors"
                >
                  Explorar Catálogo
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
