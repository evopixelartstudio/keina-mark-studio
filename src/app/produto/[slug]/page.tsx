'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/store/ProductCard';
import { useStore } from '@/context/StoreContext';
import { 
  ArrowLeft, 
  Check, 
  Truck, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  ShoppingBag,
  Clock,
  ChevronRight
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { products, categories, addToCart, calculateFreight, shippingSettings } = useStore();

  const product = products.find((p) => p.slug === slug);

  // States
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product?.variants?.[0]?.id
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'shipping' | 'care'>('details');

  // Freight calculator states
  const [cep, setCep] = useState('');
  const [freightLoading, setFreightLoading] = useState(false);
  const [freightResult, setFreightResult] = useState<any>(null);
  const [cartFeedback, setCartFeedback] = useState<string | null>(null);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F1E9]">
        <Header />
        <main className="flex-1 flex items-center justify-center p-8 text-center">
          <div className="space-y-4 max-w-md">
            <h1 className="font-editorial text-3xl text-[#242522]">Peça não encontrada</h1>
            <p className="text-sm text-[#242522]/70">
              O produto que você procura não está disponível ou o link pode ter sido alterado.
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

  const category = categories.find((c) => c.id === product.category_id);
  const images = product.images.length > 0 ? product.images : [{ id: '1', product_id: product.id, url: '/placeholder.png', is_primary: true, display_order: 1 }];
  const currentImage = images[selectedImageIndex] || images[0];

  const hasPrice = product.price !== null && product.price !== undefined && !product.is_price_on_request;
  const displayPrice = hasPrice
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price!)
    : 'Preço sob consulta';

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.status === 'published' && (p.category_id === product.category_id || p.is_featured))
    .slice(0, 4);

  const handleAddToCart = () => {
    const res = addToCart(product, selectedVariantId, quantity);
    if (res.success) {
      setCartFeedback('Item adicionado à sua sacola.');
      setTimeout(() => setCartFeedback(null), 3500);
    } else {
      setCartFeedback(res.message || 'Não foi possível adicionar este item.');
      setTimeout(() => setCartFeedback(null), 4000);
    }
  };

  const handleFreightCalc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cep.trim()) return;
    setFreightLoading(true);
    setFreightResult(null);
    try {
      const res = await calculateFreight(cep, [
        {
          id: `temp-${product.id}`,
          product_id: product.id,
          product,
          quantity: 1,
        },
      ]);
      setFreightResult(res);
    } finally {
      setFreightLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1E9]">
      <Header />

      <main className="flex-1 py-8 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-[#70775E] mb-8 font-sans">
            <Link href="/" className="hover:text-[#242522]">Início</Link>
            <ChevronRight className="w-3 h-3 text-[#C4A476]" />
            <Link href="/loja" className="hover:text-[#242522]">Loja</Link>
            {category && (
              <>
                <ChevronRight className="w-3 h-3 text-[#C4A476]" />
                <Link href={`/categoria/${category.slug}`} className="hover:text-[#242522]">
                  {category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3 text-[#C4A476]" />
            <span className="text-[#242522] truncate max-w-xs">{product.name}</span>
          </nav>

          {/* Product Hero Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Gallery Section */}
            <div className="lg:col-span-7 space-y-4">
              {/* Main large image */}
              <div className="relative aspect-4/5 w-full bg-[#F0ECE4] border border-[#E8E2D5] overflow-hidden group">
                <Image
                  src={currentImage.url}
                  alt={currentImage.alt_text || product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-105"
                  priority
                />

                {/* Floating pill tags */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {product.is_made_to_order && (
                    <span className="bg-[#87563B] text-white text-[10px] tracking-widest uppercase font-semibold px-2.5 py-1">
                      Sob encomenda
                    </span>
                  )}
                  {product.is_bulky && (
                    <span className="bg-[#70775E] text-white text-[10px] tracking-widest uppercase font-semibold px-2.5 py-1">
                      Mobiliário / Grande Porte
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails row */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-20 bg-[#F0ECE4] border transition-all shrink-0 overflow-hidden ${
                        selectedImageIndex === idx
                          ? 'border-[#87563B] ring-1 ring-[#87563B]'
                          : 'border-[#E8E2D5] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt_text || `Miniatura ${idx + 1}`}
                        fill
                        className="object-contain p-1.5"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Authenticity guarantee box */}
              <div className="bg-[#FAF7F2] p-4 border border-[#E8E2D5] flex items-center justify-between text-xs text-[#242522]/80">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#70775E]" />
                  <span>Fotografia real da peça &middot; Design autoral brasileiro</span>
                </div>
                {product.sku && (
                  <span className="font-mono text-[11px] text-[#70775E]">
                    SKU: {product.sku}
                  </span>
                )}
              </div>
            </div>

            {/* Product Purchase & Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                {category && (
                  <Link
                    href={`/categoria/${category.slug}`}
                    className="text-xs uppercase tracking-[0.25em] text-[#70775E] font-medium hover:text-[#87563B] transition-colors block mb-2"
                  >
                    {category.name}
                  </Link>
                )}
                <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#242522] font-light leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Price display */}
              <div className="pt-2 pb-4 border-b border-[#E8E2D5] flex items-baseline gap-3">
                <span className={`text-2xl sm:text-3xl ${hasPrice ? 'font-semibold text-[#242522]' : 'font-editorial italic text-[#87563B]'}`}>
                  {displayPrice}
                </span>
                {product.promotional_price && hasPrice && (
                  <span className="text-sm line-through text-[#6C6F65]">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.promotional_price)}
                  </span>
                )}
              </div>

              {/* Short editorial description */}
              {product.short_description && (
                <p className="text-sm sm:text-base text-[#242522]/80 font-light leading-relaxed">
                  {product.short_description}
                </p>
              )}

              {/* Variants selection if available */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-3 pt-2">
                  <label className="block text-xs uppercase tracking-wider text-[#70775E] font-semibold">
                    Opção / Variação:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`text-xs px-3.5 py-2 border font-medium transition-all ${
                          selectedVariantId === v.id
                            ? 'border-[#242522] bg-[#242522] text-[#F5F1E9]'
                            : 'border-[#E8E2D5] bg-[#FAF7F2] text-[#242522] hover:border-[#87563B]'
                        }`}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Add to Cart Area */}
              <div className="space-y-4 pt-4 border-t border-[#E8E2D5]">
                {hasPrice ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-[#E8E2D5] bg-[#FAF7F2]">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 py-2 text-sm text-[#242522] hover:bg-[#E8E2D5]"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 text-sm font-medium text-[#242522] min-w-[40px] text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-3 py-2 text-sm text-[#242522] hover:bg-[#E8E2D5]"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="flex-1 bg-[#242522] text-[#F5F1E9] py-3.5 px-6 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#87563B] transition-colors flex items-center justify-center gap-2 shadow-xs"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Adicionar à Sacola</span>
                      </button>
                    </div>

                    {cartFeedback && (
                      <div className="p-3 bg-[#E8E2D5]/50 border border-[#70775E]/30 text-xs text-[#242522] animate-in fade-in flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#70775E]" />
                        <span>{cartFeedback}</span>
                        <Link href="/carrinho" className="ml-auto underline font-semibold text-[#87563B]">
                          Ver Sacola
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-[#FAF7F2] p-5 border border-[#DEC9A9] space-y-3">
                    <div className="flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#87563B] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-editorial text-lg text-[#242522]">Peça Exclusiva &middot; Sob Consulta</h4>
                        <p className="text-xs text-[#242522]/75 leading-relaxed mt-1">
                          Os valores e especificações finais desta peça estão sendo confirmados pelo ateliê. Para consultar prazo de produção, personalização ou encomendar diretamente, fale conosco.
                        </p>
                      </div>
                    </div>
                    <a
                      href={`mailto:contato@keinamarkstudio.com?subject=Consulta%20sobre%20a%20peça%20${encodeURIComponent(product.name)}`}
                      className="block text-center w-full bg-[#87563B] text-white py-3 px-4 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#68412B] transition-colors"
                    >
                      Consultar Ateliê por E-mail
                    </a>
                  </div>
                )}

                {/* Production and availability notes */}
                <div className="pt-2 space-y-1.5 text-xs text-[#70775E]">
                  {product.is_made_to_order && (
                    <p className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Prazo de confecção autoral: {product.production_days || '7 a 15'} dias úteis</span>
                    </p>
                  )}
                  {product.is_bulky && (
                    <p className="flex items-center gap-2 text-[#87563B]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Peça de grande volume (mobiliário): frete via transportadora especializada</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Freight Calculator Box */}
              <div className="pt-6 border-t border-[#E8E2D5] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#242522] font-semibold flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#70775E]" />
                    Calcular Estimativa de Envio
                  </span>
                  <span className="text-[11px] text-[#70775E] font-mono">
                    Origem: {shippingSettings.origin_postal_code}
                  </span>
                </div>

                <form onSubmit={handleFreightCalc} className="flex gap-2">
                  <input
                    type="text"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    placeholder="Digite seu CEP (Ex: 01310-100)"
                    maxLength={9}
                    className="flex-1 bg-[#FAF7F2] border border-[#E8E2D5] px-3 py-2 text-xs text-[#242522] focus:outline-none focus:border-[#87563B]"
                  />
                  <button
                    type="submit"
                    disabled={freightLoading}
                    className="bg-[#242522] text-[#F5F1E9] px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-[#87563B] transition-colors disabled:opacity-50"
                  >
                    {freightLoading ? 'Consultando...' : 'Calcular'}
                  </button>
                </form>

                {freightResult && (
                  <div className="p-3 bg-[#FAF7F2] border border-[#E8E2D5] text-xs space-y-2 animate-in fade-in">
                    {freightResult.notes && (
                      <p className="text-[#242522] font-medium">{freightResult.notes}</p>
                    )}

                    {freightResult.hasBulkyItem && (
                      <div className="p-2 bg-[#DEC9A9]/30 border border-[#C4A476] text-[#87563B] text-[11px] leading-tight">
                        <strong>Aviso Logístico:</strong> Esta peça possui grandes dimensões (mobiliário). O transporte é cotado sob medida via transportadora rodoviária dedicada para garantir a integridade da madeira e estrutura.
                      </div>
                    )}

                    {freightResult.options?.map((opt: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between border-t border-[#E8E2D5] pt-1.5 text-[11px]">
                        <span className="font-medium text-[#242522]">{opt.name}</span>
                        <span className="text-[#70775E] italic">{opt.message || 'Pendente'}</span>
                      </div>
                    ))}

                    <div className="pt-2 text-[10px] text-[#70775E] border-t border-[#E8E2D5]/80">
                      Integração de cotação online conectada com base de CEP dos Correios e pronta para chave de API de transportadora.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Editorial Tabs: Sobre a peça, Detalhes técnicos, Entrega, Cuidados */}
          <div className="mt-20 pt-12 border-t border-[#E8E2D5]">
            <div className="flex border-b border-[#E8E2D5] gap-8 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`pb-4 text-xs uppercase tracking-[0.2em] font-semibold transition-colors relative whitespace-nowrap ${
                  activeTab === 'details' ? 'text-[#87563B]' : 'text-[#70775E] hover:text-[#242522]'
                }`}
              >
                Sobre a Peça
                {activeTab === 'details' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#87563B]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className={`pb-4 text-xs uppercase tracking-[0.2em] font-semibold transition-colors relative whitespace-nowrap ${
                  activeTab === 'specs' ? 'text-[#87563B]' : 'text-[#70775E] hover:text-[#242522]'
                }`}
              >
                Especificações Técnicas
                {activeTab === 'specs' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#87563B]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('shipping')}
                className={`pb-4 text-xs uppercase tracking-[0.2em] font-semibold transition-colors relative whitespace-nowrap ${
                  activeTab === 'shipping' ? 'text-[#87563B]' : 'text-[#70775E] hover:text-[#242522]'
                }`}
              >
                Entrega & Origem
                {activeTab === 'shipping' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#87563B]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('care')}
                className={`pb-4 text-xs uppercase tracking-[0.2em] font-semibold transition-colors relative whitespace-nowrap ${
                  activeTab === 'care' ? 'text-[#87563B]' : 'text-[#70775E] hover:text-[#242522]'
                }`}
              >
                Conservação
                {activeTab === 'care' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#87563B]" />
                )}
              </button>
            </div>

            <div className="py-8 max-w-3xl text-sm leading-relaxed text-[#242522]/85 font-light">
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <p>{product.description || 'Descrição detalhada em elaboração pela curadoria do studio.'}</p>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#FAF7F2] p-6 border border-[#E8E2D5]">
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-[#70775E] font-medium">Material</span>
                    <span className="text-[#242522] font-normal">{product.material || 'A confirmar'}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-[#70775E] font-medium">Dimensões</span>
                    <span className="text-[#242522] font-normal">{product.dimensions || 'A confirmar'}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-[#70775E] font-medium">Peso Aproximado</span>
                    <span className="text-[#242522] font-normal">{product.weight_kg ? `${product.weight_kg} kg` : 'A confirmar'}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-[#70775E] font-medium">Categoria</span>
                    <span className="text-[#242522] font-normal">{category?.name || 'Geral'}</span>
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-4">
                  <p>
                    Todas as peças da Keina Mark Studio são enviadas com embalagens protetoras específicas para preservar materiais nobres e acabamentos artesanais.
                  </p>
                  <p>
                    <strong>Origem de Expedição:</strong> {shippingSettings.origin_city} - {shippingSettings.origin_state} (CEP: {shippingSettings.origin_postal_code}).
                  </p>
                  <p>
                    Prazos de entrega variam de acordo com a localidade e o tipo de envio (aéreo ou rodoviário para peças de grande volume).
                  </p>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="space-y-4">
                  <p>{product.care_instructions || 'Para preservar a longevidade dos materiais, mantenha em local arejado e protegido de umidade extrema.'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20 pt-16 border-t border-[#E8E2D5]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-[#70775E] font-medium block mb-1">
                    Harmonia Visual
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl text-[#242522]">
                    Peças Complementares
                  </h3>
                </div>
                <Link
                  href="/loja"
                  className="text-xs uppercase tracking-wider font-semibold text-[#87563B] hover:text-[#242522]"
                >
                  Ver Todo o Catálogo
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((rel) => {
                  const relCat = categories.find((c) => c.id === rel.category_id);
                  return (
                    <ProductCard
                      key={rel.id}
                      product={rel}
                      categoryName={relCat?.name}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
