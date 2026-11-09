'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product, ProductImage, ProductStatus, ProductVariant } from '@/types';
import { useStore } from '@/context/StoreContext';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Plus, 
  Image as ImageIcon, 
  Check, 
  Sparkles, 
  Ruler, 
  Truck, 
  Layers, 
  FileText 
} from 'lucide-react';

interface ProductEditorFormProps {
  initialProduct?: Product;
}

export const ProductEditorForm: React.FC<ProductEditorFormProps> = ({ initialProduct }) => {
  const router = useRouter();
  const { categories, addProduct, updateProduct } = useStore();

  const isEditing = Boolean(initialProduct);

  // Form states
  const [activeTab, setActiveTab] = useState<'info' | 'content' | 'pricing' | 'shipping' | 'images' | 'variants'>('info');

  // Basic Info
  const [name, setName] = useState(initialProduct?.name || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [sku, setSku] = useState(initialProduct?.sku || '');
  const [categoryId, setCategoryId] = useState(initialProduct?.category_id || categories[0]?.id || '');
  const [status, setStatus] = useState<ProductStatus>(initialProduct?.status || 'draft');
  const [isFeatured, setIsFeatured] = useState(initialProduct?.is_featured || false);
  const [shortDescription, setShortDescription] = useState(initialProduct?.short_description || '');

  // Content
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [material, setMaterial] = useState(initialProduct?.material || '');
  const [dimensions, setDimensions] = useState(initialProduct?.dimensions || '');
  const [careInstructions, setCareInstructions] = useState(initialProduct?.care_instructions || '');

  // Pricing & Stock
  const [isPriceOnRequest, setIsPriceOnRequest] = useState(initialProduct?.is_price_on_request ?? true);
  const [price, setPrice] = useState<string>(initialProduct?.price ? String(initialProduct.price) : '');
  const [promotionalPrice, setPromotionalPrice] = useState<string>(
    initialProduct?.promotional_price ? String(initialProduct.promotional_price) : ''
  );
  const [stockQuantity, setStockQuantity] = useState<number>(initialProduct?.stock_quantity ?? 1);
  const [trackStock, setTrackStock] = useState<boolean>(initialProduct?.track_stock ?? false);
  const [isMadeToOrder, setIsMadeToOrder] = useState<boolean>(initialProduct?.is_made_to_order ?? false);
  const [productionDays, setProductionDays] = useState<string>(
    initialProduct?.production_days ? String(initialProduct.production_days) : ''
  );

  // Shipping & Logistics
  const [isBulky, setIsBulky] = useState<boolean>(initialProduct?.is_bulky ?? false);
  const [weightKg, setWeightKg] = useState<string>(initialProduct?.weight_kg ? String(initialProduct.weight_kg) : '');
  const [heightCm, setHeightCm] = useState<string>(initialProduct?.height_cm ? String(initialProduct.height_cm) : '');
  const [widthCm, setWidthCm] = useState<string>(initialProduct?.width_cm ? String(initialProduct.width_cm) : '');
  const [lengthCm, setLengthCm] = useState<string>(initialProduct?.length_cm ? String(initialProduct.length_cm) : '');

  // Images
  const [images, setImages] = useState<ProductImage[]>(
    initialProduct?.images || [
      {
        id: `img-${Date.now()}`,
        product_id: initialProduct?.id || 'temp',
        url: '/products/bolsa-marrom-ferragens-metalicas.png',
        alt_text: 'Imagem da peça',
        display_order: 1,
        is_primary: true,
      },
    ]
  );
  const [newImageUrl, setNewImageUrl] = useState('');

  // Variants
  const [variants, setVariants] = useState<ProductVariant[]>(initialProduct?.variants || []);
  const [newVariantName, setNewVariantName] = useState('');
  const [newVariantStock, setNewVariantStock] = useState('1');

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing || !slug) {
      const generated = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    const newImg: ProductImage = {
      id: `img-${Date.now()}`,
      product_id: initialProduct?.id || 'temp',
      url: newImageUrl.trim(),
      alt_text: name,
      display_order: images.length + 1,
      is_primary: images.length === 0,
    };
    setImages((prev) => [...prev, newImg]);
    setNewImageUrl('');
  };

  const handleSetPrimaryImage = (id: string) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        is_primary: img.id === id,
      }))
    );
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      if (filtered.length > 0 && !filtered.some((i) => i.is_primary)) {
        filtered[0].is_primary = true;
      }
      return filtered;
    });
  };

  const handleAddVariant = () => {
    if (!newVariantName.trim()) return;
    const newVar: ProductVariant = {
      id: `var-${Date.now()}`,
      product_id: initialProduct?.id || 'temp',
      name: newVariantName.trim(),
      stock_quantity: parseInt(newVariantStock) || 1,
    };
    setVariants((prev) => [...prev, newVar]);
    setNewVariantName('');
    setNewVariantStock('1');
  };

  const handleRemoveVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const handleSubmit = (targetStatus?: ProductStatus) => {
    if (!name.trim()) {
      alert('Por favor, informe o nome da peça.');
      return;
    }

    const finalStatus = targetStatus || status;

    const payload = {
      name: name.trim(),
      slug: slug.trim() || `produto-${Date.now()}`,
      sku: sku.trim() || undefined,
      category_id: categoryId || undefined,
      status: finalStatus,
      is_featured: isFeatured,
      short_description: shortDescription.trim() || undefined,
      description: description.trim() || undefined,
      material: material.trim() || undefined,
      dimensions: dimensions.trim() || undefined,
      care_instructions: careInstructions.trim() || undefined,
      is_price_on_request: isPriceOnRequest,
      price: !isPriceOnRequest && price ? parseFloat(price) : null,
      promotional_price: !isPriceOnRequest && promotionalPrice ? parseFloat(promotionalPrice) : null,
      stock_quantity: stockQuantity,
      track_stock: trackStock,
      is_made_to_order: isMadeToOrder,
      production_days: productionDays ? parseInt(productionDays) : null,
      is_bulky: isBulky,
      weight_kg: weightKg ? parseFloat(weightKg) : null,
      height_cm: heightCm ? parseFloat(heightCm) : null,
      width_cm: widthCm ? parseFloat(widthCm) : null,
      length_cm: lengthCm ? parseFloat(lengthCm) : null,
      images: images.length > 0 ? images : [
        {
          id: `img-default`,
          product_id: initialProduct?.id || 'temp',
          url: '/products/bolsa-marrom-ferragens-metalicas.png',
          display_order: 1,
          is_primary: true,
        }
      ],
      variants,
    };

    if (isEditing && initialProduct) {
      updateProduct(initialProduct.id, payload);
    } else {
      addProduct(payload);
    }

    router.push('/admin/produtos');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D5] pb-6">
        <div>
          <button
            type="button"
            onClick={() => router.push('/admin/produtos')}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#70775E] hover:text-[#242522] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar à Listagem</span>
          </button>
          <h1 className="font-editorial text-3xl text-[#242522]">
            {isEditing ? `Editar: ${initialProduct?.name}` : 'Cadastrar Nova Peça'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            className="px-4 py-2.5 bg-[#FAF7F2] border border-[#E8E2D5] text-xs uppercase tracking-wider font-semibold text-[#242522] hover:bg-[#E8E2D5] transition-colors"
          >
            Salvar como Rascunho
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('published')}
            className="px-5 py-2.5 bg-[#242522] text-[#F5F1E9] text-xs uppercase tracking-wider font-semibold hover:bg-[#87563B] transition-colors flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Publicar Peça</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#E8E2D5] gap-6 text-xs uppercase tracking-wider font-medium overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'info' ? 'border-[#87563B] text-[#87563B] font-semibold' : 'border-transparent text-[#70775E] hover:text-[#242522]'
          }`}
        >
          1. Identificação Básica
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'content' ? 'border-[#87563B] text-[#87563B] font-semibold' : 'border-transparent text-[#70775E] hover:text-[#242522]'
          }`}
        >
          2. Descrição & Materiais
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pricing')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'pricing' ? 'border-[#87563B] text-[#87563B] font-semibold' : 'border-transparent text-[#70775E] hover:text-[#242522]'
          }`}
        >
          3. Preço & Estoque
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('shipping')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'shipping' ? 'border-[#87563B] text-[#87563B] font-semibold' : 'border-transparent text-[#70775E] hover:text-[#242522]'
          }`}
        >
          4. Frete & Medidas
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('images')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'images' ? 'border-[#87563B] text-[#87563B] font-semibold' : 'border-transparent text-[#70775E] hover:text-[#242522]'
          }`}
        >
          5. Fotografias ({images.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('variants')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'variants' ? 'border-[#87563B] text-[#87563B] font-semibold' : 'border-transparent text-[#70775E] hover:text-[#242522]'
          }`}
        >
          6. Variações ({variants.length})
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white p-6 sm:p-8 border border-[#E8E2D5] space-y-6 text-xs">
        {/* TAB 1: INFO */}
        {activeTab === 'info' && (
          <div className="space-y-4 max-w-2xl">
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider text-[#70775E] font-semibold">
                Nome da Peça *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ex: Bolsa Estruturada com Ferragens Metálicas"
                required
                className="w-full bg-[#FAF7F2] border border-[#E8E2D5] p-3 text-sm text-[#242522] focus:outline-none focus:border-[#87563B]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider text-[#70775E] font-semibold">
                  Slug da URL
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="bolsa-marrom-ferragens"
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D5] p-2.5 font-mono text-xs focus:outline-none focus:border-[#87563B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider text-[#70775E] font-semibold">
                  Código SKU
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="KMS-ACS-001"
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D5] p-2.5 font-mono text-xs focus:outline-none focus:border-[#87563B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider text-[#70775E] font-semibold">
                  Categoria
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D5] p-2.5 text-xs focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider text-[#70775E] font-semibold">
                  Status de Publicação
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProductStatus)}
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D5] p-2.5 text-xs focus:outline-none"
                >
                  <option value="published">Publicado (visível na loja)</option>
                  <option value="draft">Rascunho (apenas administrativo)</option>
                  <option value="archived">Arquivado (oculto)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="feat"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded text-[#87563B]"
              />
              <label htmlFor="feat" className="text-xs text-[#242522]">
                Destacar esta peça na página inicial e na coleção editorial
              </label>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="block uppercase tracking-wider text-[#70775E] font-semibold">
                Descrição Curta (Editorial)
              </label>
              <textarea
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                rows={3}
                placeholder="Resumo em 1 ou 2 frases da peça..."
                className="w-full bg-[#FAF7F2] border border-[#E8E2D5] p-2.5 text-xs focus:outline-none focus:border-[#87563B]"
              />
            </div>
          </div>
        )}

        {/* TAB 2: CONTENT & MATERIALS */}
        {activeTab === 'content' && (
          <div className="space-y-4 max-w-2xl">
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider text-[#70775E] font-semibold">
                Descrição Detalhada / Narrativa Autoral
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Descreva a inspiração, técnicas de confecção, acabamento e origem..."
                className="w-full bg-[#FAF7F2] border border-[#E8E2D5] p-3 text-xs leading-relaxed focus:outline-none focus:border-[#87563B]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider text-[#70775E] font-semibold">
                  Composição / Matérias-Primas
                </label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="Ex: Madeira maciça e estrutura em aço"
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D5] p-2.5 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider text-[#70775E] font-semibold">
                  Dimensões Físicas
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="Ex: 80 x 50 x 50 cm"
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D5] p-2.5 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider text-[#70775E] font-semibold">
                Cuidados e Conservação
              </label>
              <textarea
                value={careInstructions}
                onChange={(e) => setCareInstructions(e.target.value)}
                rows={3}
                placeholder="Instruções de limpeza, conservação e preservação..."
                className="w-full bg-[#FAF7F2] border border-[#E8E2D5] p-2.5 text-xs focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* TAB 3: PRICING & STOCK */}
        {activeTab === 'pricing' && (
          <div className="space-y-5 max-w-2xl">
            <div className="p-4 bg-[#FAF7F2] border border-[#DEC9A9] space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="reqPrice"
                  checked={isPriceOnRequest}
                  onChange={(e) => setIsPriceOnRequest(e.target.checked)}
                  className="rounded text-[#87563B]"
                />
                <label htmlFor="reqPrice" className="text-xs font-semibold text-[#87563B]">
                  Preço Sob Consulta (Recomendado enquanto os valores finais não foram homologados)
                </label>
              </div>
              <p className="text-[11px] text-[#242522]/70 leading-relaxed pl-5">
                Quando ativado, o produto exibirá &quot;Preço sob consulta&quot; na loja e não permitirá adição direta ao carrinho financeiro.
              </p>
            </div>

            {!isPriceOnRequest && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider text-[#70775E] font-semibold">
                    Preço Regular (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="250.00"
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D5] p-2.5 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block uppercase tracking-wider text-[#70775E] font-semibold">
                    Preço Promocional (Opcional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={promotionalPrice}
                    onChange={(e) => setPromotionalPrice(e.target.value)}
                    placeholder="199.00"
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D5] p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-[#E8E2D5] space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="trStock"
                  checked={trackStock}
                  onChange={(e) => setTrackStock(e.target.checked)}
                  className="rounded text-[#87563B]"
                />
                <label htmlFor="trStock" className="text-xs text-[#242522] font-medium">
                  Controlar estoque físico desta peça
                </label>
              </div>

              {trackStock && (
                <div className="space-y-1.5 max-w-xs">
                  <label className="block uppercase tracking-wider text-[#70775E] font-semibold">
                    Quantidade em Estoque
                  </label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                    min={0}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D5] p-2.5 text-xs focus:outline-none"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="mto"
                  checked={isMadeToOrder}
                  onChange={(e) => setIsMadeToOrder(e.target.checked)}
                  className="rounded text-[#87563B]"
                />
                <label htmlFor="mto" className="text-xs text-[#242522] font-medium">
                  Peça produzida sob encomenda (confecção artesanal)
                </label>
              </div>

              {isMadeToOrder && (
                <div className="space-y-1.5 max-w-xs pl-5">
                  <label className="block uppercase tracking-wider text-[#70775E] font-semibold">
                    Prazo de Produção (Dias úteis)
                  </label>
                  <input
                    type="number"
                    value={productionDays}
                    onChange={(e) => setProductionDays(e.target.value)}
                    placeholder="Ex: 10"
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D5] p-2.5 text-xs focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: SHIPPING & DIMENSIONS */}
        {activeTab === 'shipping' && (
          <div className="space-y-5 max-w-2xl">
            <div className="p-4 bg-[#F5F1E9] border border-[#DEC9A9] space-y-2">
              <span className="font-semibold text-xs text-[#87563B] block uppercase tracking-wider">
                Dados Logísticos para Cotação de Frete
              </span>
              <p className="text-[11px] text-[#242522]/80 leading-relaxed">
                As dimensões com embalagem e peso são fundamentais para que as APIs dos Correios e transportadoras calculem valores reais.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="bulky"
                checked={isBulky}
                onChange={(e) => setIsBulky(e.target.checked)}
                className="rounded text-[#87563B]"
              />
              <label htmlFor="bulky" className="text-xs font-semibold text-[#87563B]">
                Peça de Grande Volume (Mobiliário / Cadeiras / Painéis)
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider text-[#70775E] font-semibold">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder="Ex: 3.20"
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D5] p-2.5 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider text-[#70775E] font-semibold">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="Ex: 80"
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D5] p-2.5 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider text-[#70775E] font-semibold">
                  Largura (cm)
                </label>
                <input
                  type="number"
                  value={widthCm}
                  onChange={(e) => setWidthCm(e.target.value)}
                  placeholder="Ex: 55"
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D5] p-2.5 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block uppercase tracking-wider text-[#70775E] font-semibold">
                  Comprimento (cm)
                </label>
                <input
                  type="number"
                  value={lengthCm}
                  onChange={(e) => setLengthCm(e.target.value)}
                  placeholder="Ex: 50"
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D5] p-2.5 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: IMAGES */}
        {activeTab === 'images' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-editorial text-lg text-[#242522]">Galeria de Fotografias</h3>
              <p className="text-[11px] text-[#70775E]">
                Selecione qual fotografia será a principal (capa do card) e adicione novas URLs de imagem.
              </p>
            </div>

            {/* Existing images list */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className={`relative p-2 border bg-[#FAF7F2] flex flex-col justify-between ${
                    img.is_primary ? 'border-[#87563B] ring-1 ring-[#87563B]' : 'border-[#E8E2D5]'
                  }`}
                >
                  <div className="relative aspect-4/5 w-full bg-[#F0ECE4] overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.alt_text || ''}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    {img.is_primary ? (
                      <span className="text-[#87563B] font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Principal
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(img.id)}
                        className="text-[#70775E] hover:text-[#242522]"
                      >
                        Tornar Principal
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new image url */}
            <div className="pt-4 border-t border-[#E8E2D5] flex gap-2 max-w-lg">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="/products/nome-da-imagem.png ou URL externa"
                className="flex-1 bg-[#FAF7F2] border border-[#E8E2D5] p-2 text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="bg-[#242522] text-[#F5F1E9] px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-[#87563B]"
              >
                Adicionar Foto
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: VARIANTS */}
        {activeTab === 'variants' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="font-editorial text-lg text-[#242522]">Variações da Peça</h3>
              <p className="text-[11px] text-[#70775E]">
                Exemplo: Tamanhos (P, M, G, GG), Cores ou Modelos específicos.
              </p>
            </div>

            <div className="space-y-2">
              {variants.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between p-3 bg-[#FAF7F2] border border-[#E8E2D5]"
                >
                  <div>
                    <span className="font-semibold text-xs text-[#242522]">{v.name}</span>
                    <span className="text-[11px] text-[#70775E] ml-3">
                      Estoque: {v.stock_quantity} un.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(v.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {variants.length === 0 && (
                <p className="text-xs text-[#70775E] py-2">
                  Nenhuma variação configurada. A peça será vendida no modelo padrão único.
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-[#E8E2D5] flex gap-2">
              <input
                type="text"
                value={newVariantName}
                onChange={(e) => setNewVariantName(e.target.value)}
                placeholder="Nome da variação (Ex: Tamanho M / Tabaco)"
                className="flex-1 bg-[#FAF7F2] border border-[#E8E2D5] p-2 text-xs focus:outline-none"
              />
              <input
                type="number"
                value={newVariantStock}
                onChange={(e) => setNewVariantStock(e.target.value)}
                placeholder="Estoque"
                min={0}
                className="w-20 bg-[#FAF7F2] border border-[#E8E2D5] p-2 text-xs focus:outline-none text-center"
              />
              <button
                type="button"
                onClick={handleAddVariant}
                className="bg-[#242522] text-[#F5F1E9] px-4 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-[#87563B]"
              >
                Adicionar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
