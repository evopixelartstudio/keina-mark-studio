"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useStore } from "@/context/StoreContext";
import { formatCep } from "@/lib/utils";
import {
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  Save,
  AlertCircle,
  Info,
} from "lucide-react";

export default function AdminSettingsPage() {
  const {
    storeSettings,
    shippingSettings,
    updateStoreSettings,
    updateShippingSettings,
    resetCatalogToDefault,
  } = useStore();

  const [storeForm, setStoreForm] = useState(storeSettings);
  const [shippingForm, setShippingForm] = useState(shippingSettings);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(storeForm);
    updateShippingSettings(shippingForm);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E2D5] gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#70775E] font-medium block mb-1">
              Preferências do Sistema
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl text-[#242522]">
              Configurações Gerais
            </h1>
            <p className="text-xs text-[#242522]/70 mt-0.5">
              Gerencie a identidade básica, o CEP de expedição e confira o status das integrações.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#242522] text-[#F5F1E9] text-xs font-sans font-semibold uppercase tracking-[0.18em] hover:bg-[#87563B] transition-colors shadow-xs self-start sm:self-auto"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Dados</span>
          </button>
        </div>

        {saved && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 font-sans flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Configurações salvas com sucesso!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 text-xs font-sans">
          {/* Identity & Contacts */}
          <div className="bg-white border border-[#E8E2D5] p-6 sm:p-8 space-y-4">
            <h2 className="font-editorial text-xl text-[#242522] border-b border-[#E8E2D5] pb-2">
              Identidade & Atendimento
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#242522] font-medium mb-1">
                  Nome da Marca / Loja
                </label>
                <input
                  type="text"
                  value={storeForm.store_name}
                  onChange={(e) =>
                    setStoreForm({ ...storeForm, store_name: e.target.value })
                  }
                  className="w-full p-2 bg-[#FAF7F2] border border-[#E8E2D5]"
                />
              </div>

              <div>
                <label className="block text-[#242522] font-medium mb-1">
                  Tagline / Assinatura
                </label>
                <input
                  type="text"
                  value={storeForm.tagline}
                  onChange={(e) =>
                    setStoreForm({ ...storeForm, tagline: e.target.value })
                  }
                  className="w-full p-2 bg-[#FAF7F2] border border-[#E8E2D5]"
                />
              </div>

              <div>
                <label className="block text-[#242522] font-medium mb-1">
                  E-mail Oficial de Atendimento
                </label>
                <input
                  type="email"
                  value={storeForm.contact_email}
                  onChange={(e) =>
                    setStoreForm({ ...storeForm, contact_email: e.target.value })
                  }
                  className="w-full p-2 bg-[#FAF7F2] border border-[#E8E2D5]"
                />
              </div>

              <div>
                <label className="block text-[#242522] font-medium mb-1">
                  Instagram Oficial
                </label>
                <input
                  type="text"
                  value={storeForm.instagram}
                  onChange={(e) =>
                    setStoreForm({ ...storeForm, instagram: e.target.value })
                  }
                  placeholder="@keinamarkstudio"
                  className="w-full p-2 bg-[#FAF7F2] border border-[#E8E2D5]"
                />
              </div>
            </div>
          </div>

          {/* Shipping Origin Configuration */}
          <div className="bg-white border border-[#E8E2D5] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E8E2D5] pb-2">
              <MapPin className="w-4 h-4 text-[#87563B]" />
              <h2 className="font-editorial text-xl text-[#242522]">
                Endereço de Origem para Cálculo de Frete
              </h2>
            </div>
            <p className="text-[#242522]/70 text-[11px] leading-relaxed">
              Define o ponto de partida das remessas no cálculo do frete. Atualize conforme o local real de saída do ateliê.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#242522] font-medium mb-1">
                  CEP de Expedição (Origem)
                </label>
                <input
                  type="text"
                  value={shippingForm.origin_postal_code}
                  onChange={(e) =>
                    setShippingForm({
                      ...shippingForm,
                      origin_postal_code: formatCep(e.target.value),
                    })
                  }
                  maxLength={9}
                  className="w-full p-2 bg-[#FAF7F2] border border-[#E8E2D5] font-mono"
                />
              </div>

              <div>
                <label className="block text-[#242522] font-medium mb-1">
                  Logradouro de Saída
                </label>
                <input
                  type="text"
                  value={shippingForm.origin_street}
                  onChange={(e) =>
                    setShippingForm({ ...shippingForm, origin_street: e.target.value })
                  }
                  className="w-full p-2 bg-[#FAF7F2] border border-[#E8E2D5]"
                />
              </div>

              <div>
                <label className="block text-[#242522] font-medium mb-1">
                  Cidade de Origem
                </label>
                <input
                  type="text"
                  value={shippingForm.origin_city}
                  onChange={(e) =>
                    setShippingForm({ ...shippingForm, origin_city: e.target.value })
                  }
                  className="w-full p-2 bg-[#FAF7F2] border border-[#E8E2D5]"
                />
              </div>

              <div>
                <label className="block text-[#242522] font-medium mb-1">
                  Estado (UF)
                </label>
                <input
                  type="text"
                  value={shippingForm.origin_state}
                  onChange={(e) =>
                    setShippingForm({
                      ...shippingForm,
                      origin_state: e.target.value.toUpperCase(),
                    })
                  }
                  maxLength={2}
                  className="w-full p-2 bg-[#FAF7F2] border border-[#E8E2D5] uppercase font-mono"
                />
              </div>
            </div>
          </div>

          {/* Freight Carrier Gateway Status */}
          <div className="bg-white border border-[#E8E2D5] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E8E2D5] pb-2">
              <Truck className="w-4 h-4 text-[#87563B]" />
              <h2 className="font-editorial text-xl text-[#242522]">
                Integração Logística (Melhor Envio / Frenet / Correios)
              </h2>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-800" />
              <div>
                <span className="font-semibold block">
                  Status: Aguardando Credenciais de Produção
                </span>
                <p className="text-[11px] leading-relaxed text-amber-800/90 mt-0.5">
                  A arquitetura de cálculo e validação por CEP está implementada e testada. As credenciais do gateway de frete serão configuradas via variáveis de ambiente no servidor quando contratadas com a transportadora. Não exibimos valores simulados.
                </p>
              </div>
            </div>
          </div>

          {/* Payments Status */}
          <div className="bg-white border border-[#E8E2D5] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E8E2D5] pb-2">
              <CreditCard className="w-4 h-4 text-[#87563B]" />
              <h2 className="font-editorial text-xl text-[#242522]">
                Processamento de Pagamentos Online
              </h2>
            </div>

            <div className="p-3 bg-[#FAF7F2] border border-[#E8E2D5] flex items-start gap-2.5 text-[#242522]">
              <Info className="w-4 h-4 text-[#87563B] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#242522] block">
                  Status: Não Configurado (Fase 1 Visual & Demonstrativa)
                </span>
                <p className="text-[11px] leading-relaxed text-[#242522]/70 mt-0.5">
                  Conforme a diretriz do projeto, o pagamento online ainda não está ativado. O carrinho funciona plenamente com validação de estoque e estimativa de CEP, mas a finalização permanece identificada como &quot;Em breve&quot;.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => {
                if (confirm("Deseja redefinir os dados para o padrão de catálogo inicial?")) {
                  resetCatalogToDefault();
                  alert("Catálogo redefinido com sucesso!");
                }
              }}
              className="text-xs text-red-700 hover:underline"
            >
              Restaurar Catálogo Padrão
            </button>

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
