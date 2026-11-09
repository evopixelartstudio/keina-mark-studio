import React from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { INITIAL_CUSTOMERS } from "@/lib/initial-data";
import { Shield, Lock } from "lucide-react";

export default function AdminCustomersPage() {
  const customers = INITIAL_CUSTOMERS;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E2D5] gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#70775E] font-medium block mb-1">
              Base de Usuários
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl text-[#242522]">
              Clientes Cadastrados ({customers.length})
            </h1>
            <p className="text-xs text-[#242522]/70 font-sans mt-0.5">
              Consulte as contas registradas para entrega e relacionamento da Keina Mark Studio.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white border border-[#E8E2D5] flex items-center gap-2 text-xs font-sans text-[#242522]/70">
          <Lock className="w-4 h-4 text-[#87563B] shrink-0" />
          <span>
            Privacidade & LGPD: Senhas são criptografadas no Supabase Auth e protegidas por Row Level Security.
          </span>
        </div>

        {/* Customers Table */}
        <div className="bg-white border border-[#E8E2D5] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#F5F1E9] text-[#70775E] uppercase tracking-wider border-b border-[#E8E2D5] text-[10px]">
                <tr>
                  <th className="py-3 px-4">Nome</th>
                  <th className="py-3 px-4">E-mail</th>
                  <th className="py-3 px-4">Perfil</th>
                  <th className="py-3 px-4">Data de Cadastro</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D5] text-[#242522]">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-sm">
                      {c.first_name} {c.last_name}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-[#242522]/75">
                      {c.email}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${
                          c.role === "admin"
                            ? "bg-[#242522] text-[#F5F1E9]"
                            : "bg-[#F5F1E9] border border-[#E8E2D5] text-[#242522]"
                        }`}
                      >
                        {c.role === "admin" && <Shield className="w-3 h-3 text-[#C4A476]" />}
                        {c.role === "admin" ? "Administradora" : "Cliente"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#70775E] font-mono text-[11px]">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString("pt-BR") : "08/11/2026"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-emerald-100 text-emerald-800">
                        Ativo
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
