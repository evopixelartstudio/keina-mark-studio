"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { initialCollections, initialProducts } from "@/lib/mock-data";
import { Collection, Product } from "@/types";
import { Layers, Plus, Edit2, CheckCircle2, Sparkles } from "lucide-react";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(true);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const startEdit = (col: Collection) => {
    setEditingCollection(col);
    setName(col.name);
    setSlug(col.slug);
    setSubtitle(col.subtitle || "");
    setDescription(col.description || "");
    setBannerUrl(col.banner_url || "");
    setIsFeatured(col.is_featured ?? true);
    setSelectedProductIds(col.product_ids || []);
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    if (editingCollection) {
      setCollections(
        collections.map((c) =>
          c.id === editingCollection.id
            ? {
                ...c,
                name,
                slug,
                subtitle: subtitle || null,
                description: description || null,
                banner_url: bannerUrl || null,
                is_featured: isFeatured,
                product_ids: selectedProductIds,
              }
            : c
        )
      );
    } else {
      const newCol: Collection = {
        id: `col-${Date.now()}`,
        name,
        slug,
        subtitle: subtitle || null,
        description: description || null,
        banner_url: bannerUrl || null,
        is_featured: isFeatured,
        is_active: true,
        display_order: collections.length + 1,
        product_ids: selectedProductIds,
      };
      setCollections([...collections, newCol]);
    }

    setIsFormOpen(false);
    setEditingCollection(null);
  };

  const toggleProductInCollection = (productId: string) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(selectedProductIds.filter((id) => id !== productId));
    } else {
      setSelectedProductIds([...selectedProductIds, productId]);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-grafite/10 gap-4">
          <div>
            <span className="text-xs font-sans uppercase tracking-[0.25em] text-couro font-medium block mb-1">
              Curadoria & Destaques
            </span>
            <h1 className="font-serif text-3xl font-light text-grafite">
              Coleções Editoriais
            </h1>
            <p className="text-xs text-grafite/60 font-sans mt-0.5">
              Crie seleções temáticas e campanhas para destacar na página inicial da loja.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingCollection(null);
              setName("");
              setSlug("");
              setSubtitle("");
              setDescription("");
              setBannerUrl("/products/banco-rustico-madeira-metal.png");
              setIsFeatured(true);
              setSelectedProductIds([]);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-grafite text-marfim text-xs font-sans uppercase tracking-wider font-semibold hover:bg-couro transition-colors shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Coleção</span>
          </button>
        </div>

        {isFormOpen && (
          <div className="bg-marfim-50 border border-couro/30 p-6 max-w-2xl space-y-4">
            <h3 className="font-serif text-xl text-grafite">
              {editingCollection ? "Editar Coleção" : "Nova Coleção Editorial"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-grafite/80 font-medium mb-1">
                    Título da Coleção
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editingCollection) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                    }}
                    required
                    placeholder="Ex: Peças com Identidade"
                    className="w-full p-2 bg-marfim border border-grafite/20"
                  />
                </div>
                <div>
                  <label className="block text-grafite/80 font-medium mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    placeholder="pecas-com-identidade"
                    className="w-full p-2 bg-marfim border border-grafite/20 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-grafite/80 font-medium mb-1">
                  Subtítulo / Chamada Editorial
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Seleção autoral com expressão contemporânea..."
                  className="w-full p-2 bg-marfim border border-grafite/20"
                />
              </div>

              <div>
                <label className="block text-grafite/80 font-medium mb-1">
                  Descrição Completa
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Texto explicativo da coleção..."
                  className="w-full p-2 bg-marfim border border-grafite/20"
                />
              </div>

              <div>
                <label className="block text-grafite/80 font-medium mb-1">
                  URL da Imagem / Banner
                </label>
                <input
                  type="text"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="/products/banco-rustico-madeira-metal.png"
                  className="w-full p-2 bg-marfim border border-grafite/20"
                />
              </div>

              {/* Product Selection */}
              <div className="space-y-2 pt-2 border-t border-grafite/10">
                <label className="block text-grafite/80 font-medium">
                  Selecione as peças que integram esta coleção:
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-marfim border border-grafite/15">
                  {initialProducts.map((p) => {
                    const isSelected = selectedProductIds.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className={`p-2 border flex items-center gap-2 cursor-pointer transition-colors ${
                          isSelected ? "bg-marfim-200 border-couro" : "border-grafite/10"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleProductInCollection(p.id)}
                          className="accent-couro"
                        />
                        <span className="truncate text-[11px] font-serif">{p.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-grafite">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-couro w-4 h-4"
                  />
                  <span>Destacar esta coleção na Página Inicial da loja</span>
                </label>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="submit"
                  className="px-5 py-2 bg-couro text-marfim text-xs font-semibold uppercase tracking-wider hover:bg-couro-hover"
                >
                  Salvar Coleção
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-marfim border border-grafite/20 text-grafite text-xs uppercase tracking-wider hover:bg-marfim-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Collections List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((col) => (
            <div
              key={col.id}
              className="bg-marfim-50 border border-grafite/10 p-6 flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-couro" />
                    <h3 className="font-serif text-xl font-medium text-grafite">
                      {col.name}
                    </h3>
                  </div>
                  {col.is_featured && (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-couro text-marfim font-semibold">
                      Destaque Home
                    </span>
                  )}
                </div>

                {col.subtitle && (
                  <p className="text-xs text-grafite/70 font-serif italic mb-2">
                    {col.subtitle}
                  </p>
                )}

                <p className="text-xs text-grafite/60 font-sans leading-relaxed line-clamp-2">
                  {col.description}
                </p>

                <div className="mt-3 text-[11px] font-sans text-grafite/50">
                  {col.product_ids?.length || 0} produtos associados
                </div>
              </div>

              <div className="pt-3 border-t border-grafite/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-couro">
                  /colecao/{col.slug}
                </span>
                <button
                  type="button"
                  onClick={() => startEdit(col)}
                  className="text-xs font-sans uppercase tracking-wider text-couro hover:underline font-semibold flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
