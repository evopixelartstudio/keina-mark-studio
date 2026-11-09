"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useStore } from "@/context/StoreContext";
import { CheckCircle2, Save } from "lucide-react";

export default function AdminAppearancePage() {
  const { appearanceSettings, updateAppearanceSettings } = useStore();
  const [formData, setFormData] = useState(appearanceSettings);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAppearanceSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E2D5] gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#70775E] font-medium block mb-1">
              Personalização Visual
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl text-[#242522]">
              Aparência da Página Inicial
            </h1>
            <p className="text-xs text-[#242522]/70 mt-0.5">
              Edite os títulos, chamadas editoriais e manifestos da home sem alterar o código.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#242522] text-[#F5F1E9] text-xs font-sans font-semibold uppercase tracking-[0.18em] hover:bg-[#87563B] transition-colors shadow-xs self-start sm:self-auto"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Alterações</span>
          </button>
        </div>

        {saved && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 font-sans flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Conteúdos da página inicial atualizados com sucesso!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 text-xs font-sans">
          {/* Hero Section */}
          <div className="bg-white border border-[#E8E2D5] p-6 sm:p-8 space-y-4">
            <h2 className="font-editorial text-xl text-[#242522] border-b border-[#E8E2D5] pb-2">
              1. Hero Editorial (Primeira Dobra)
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[#242522] font-medium mb-1">
                  Título Principal da Hero
                </label>
                <textarea
                  rows={2}
                  value={formData.hero_title}
                  onChange={(e) =>
                    setFormData({ ...formData, hero_title: e.target.value })
                  }
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D5] font-editorial text-lg"
                />
              </div>

              <div>
                <label className="block text-[#242522] font-medium mb-1">
                  Subtítulo / Declaração de Curadoria
                </label>
                <textarea
                  rows={2}
                  value={formData.hero_subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, hero_subtitle: e.target.value })
                  }
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D5]"
                />
              </div>

              <div>
                <label className="block text-[#242522] font-medium mb-1">
                  Texto do Botão Principal (CTA)
                </label>
                <input
                  type="text"
                  value={formData.hero_cta}
                  onChange={(e) =>
                    setFormData({ ...formData, hero_cta: e.target.value })
                  }
                  className="w-full p-2 bg-[#FAF7F2] border border-[#E8E2D5]"
                />
              </div>
            </div>
          </div>

          {/* Section Essence */}
          <div className="bg-white border border-[#E8E2D5] p-6 sm:p-8 space-y-4">
            <h2 className="font-editorial text-xl text-[#242522] border-b border-[#E8E2D5] pb-2">
              2. Seção Institucional &quot;A Essência da Marca&quot;
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[#242522] font-medium mb-1">
                  Título da Seção
                </label>
                <input
                  type="text"
                  value={formData.essence_title}
                  onChange={(e) =>
                    setFormData({ ...formData, essence_title: e.target.value })
                  }
                  className="w-full p-2 bg-[#FAF7F2] border border-[#E8E2D5] font-editorial text-base"
                />
              </div>

              <div>
                <label className="block text-[#242522] font-medium mb-1">
                  Parágrafo 1 (Manifesto Provisório)
                </label>
                <textarea
                  rows={3}
                  value={formData.essence_p1}
                  onChange={(e) =>
                    setFormData({ ...formData, essence_p1: e.target.value })
                  }
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D5] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[#242522] font-medium mb-1">
                  Parágrafo 2 (Materiais & Processos)
                </label>
                <textarea
                  rows={3}
                  value={formData.essence_p2}
                  onChange={(e) =>
                    setFormData({ ...formData, essence_p2: e.target.value })
                  }
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D5] leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-[#87563B] text-[#F5F1E9] text-xs font-sans font-semibold uppercase tracking-[0.2em] hover:bg-[#242522] transition-colors shadow-xs"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
