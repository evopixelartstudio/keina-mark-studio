"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { initialCategories } from "@/lib/mock-data";
import { Category } from "@/types";
import { FolderTree, Plus, Edit2, Trash2, Check, ArrowUpDown } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [order, setOrder] = useState<number>(1);

  const startEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setImageUrl(cat.image_url || "");
    setOrder(cat.order || cat.display_order || 1);
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    if (editingCategory) {
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                name,
                slug,
                description: description || null,
                image_url: imageUrl || "/products/bolsa-marrom-ferragens.png",
                order: Number(order),
                display_order: Number(order),
              }
            : c
        )
      );
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name,
        slug,
        description: description || null,
        image_url: imageUrl || "/products/bolsa-marrom-ferragens.png",
        order: Number(order),
        display_order: Number(order),
        is_active: true,
      };
      setCategories([...categories, newCat]);
    }

    setIsCreating(false);
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImageUrl("");
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-grafite/10 gap-4">
          <div>
            <span className="text-xs font-sans uppercase tracking-[0.25em] text-couro font-medium block mb-1">
              Organização da Loja
            </span>
            <h1 className="font-serif text-3xl font-light text-grafite">
              Categorias de Produtos
            </h1>
            <p className="text-xs text-grafite/60 font-sans mt-0.5">
              Estruture os universos da marca exibidos no menu e na página inicial.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingCategory(null);
              setName("");
              setSlug("");
              setDescription("");
              setImageUrl("");
              setOrder(categories.length + 1);
              setIsCreating(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-grafite text-marfim text-xs font-sans uppercase tracking-wider font-semibold hover:bg-couro transition-colors shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Categoria</span>
          </button>
        </div>

        {/* Modal / Form */}
        {isCreating && (
          <div className="bg-marfim-50 border border-couro/30 p-6 max-w-xl space-y-4">
            <h3 className="font-serif text-xl text-grafite">
              {editingCategory ? "Editar Categoria" : "Nova Categoria"}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block text-grafite/80 font-medium mb-1">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategory) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }}
                  required
                  placeholder="Ex: Mobiliário Autoral"
                  className="w-full p-2 bg-marfim border border-grafite/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-grafite/80 font-medium mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    placeholder="mobiliario"
                    className="w-full p-2 bg-marfim border border-grafite/20 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-grafite/80 font-medium mb-1">
                    Ordem de Exibição
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                    className="w-full p-2 bg-marfim border border-grafite/20 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-grafite/80 font-medium mb-1">
                  URL da Imagem de Capa
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/products/nome-da-foto.png"
                  className="w-full p-2 bg-marfim border border-grafite/20"
                />
              </div>

              <div>
                <label className="block text-grafite/80 font-medium mb-1">
                  Descrição Curta
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Apresentação breve da categoria..."
                  className="w-full p-2 bg-marfim border border-grafite/20"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="px-5 py-2 bg-couro text-marfim text-xs font-semibold uppercase tracking-wider hover:bg-couro-hover"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 bg-marfim border border-grafite/20 text-grafite text-xs uppercase tracking-wider hover:bg-marfim-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-marfim-50 border border-grafite/10 p-4 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="relative aspect-4/3 w-full bg-marfim-200 overflow-hidden mb-3">
                  <Image
                    src={cat.image_url || "/products/bolsa-marrom-ferragens-metalicas.png"}
                    alt={cat.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-medium text-grafite">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] font-mono text-grafite/40">
                    Posição #{cat.order || cat.display_order || 1}
                  </span>
                </div>
                <p className="text-xs text-grafite/60 font-sans mt-1 line-clamp-2">
                  {cat.description}
                </p>
                <span className="text-[10px] font-mono text-couro block mt-1">
                  /{cat.slug}
                </span>
              </div>

              <div className="pt-3 border-t border-grafite/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(cat)}
                  className="p-1.5 text-grafite/60 hover:text-couro"
                  title="Editar categoria"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
