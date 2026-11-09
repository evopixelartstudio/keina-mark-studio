"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import {
  LayoutDashboard,
  Package,
  Layers,
  FolderTree,
  Users,
  Palette,
  Settings,
  LogOut,
  Store,
  Menu,
  X,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, loginAsDemoAdmin } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = currentUser?.role === "admin";

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Produtos", href: "/admin/produtos", icon: Package },
    { label: "Categorias", href: "/admin/categorias", icon: FolderTree },
    { label: "Coleções", href: "/admin/colecoes", icon: Layers },
    { label: "Clientes", href: "/admin/clientes", icon: Users },
    { label: "Aparência da Loja", href: "/admin/aparencia", icon: Palette },
    { label: "Configurações", href: "/admin/configuracoes", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    router.push("/entrar");
  };

  // Permission gate
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1E9] p-6">
        <div className="max-w-md w-full bg-[#FAF7F2] border border-[#E8E2D5] p-8 text-center space-y-4 shadow-sm">
          <AlertTriangle className="w-10 h-10 text-[#87563B] mx-auto" />
          <h2 className="font-editorial text-2xl text-[#242522]">Acesso Administrativo Restrito</h2>
          <p className="text-xs text-[#242522]/70 leading-relaxed font-sans">
            Esta área é reservada para a administradora da Keina Mark Studio. Apenas usuários com perfil autorizado têm acesso ao catálogo e configurações.
          </p>
          <div className="pt-2 flex flex-col gap-2 font-sans">
            <button
              type="button"
              onClick={() => loginAsDemoAdmin()}
              className="py-2.5 bg-[#242522] text-[#F5F1E9] text-xs uppercase tracking-wider font-semibold hover:bg-[#87563B] transition-colors"
            >
              Liberar Acesso como Administradora
            </button>
            <Link
              href="/"
              className="py-2 text-xs text-[#242522]/60 hover:text-[#242522]"
            >
              Voltar para a Loja Virtual
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F5F1E9] text-[#242522]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col justify-between bg-[#242522] text-[#F5F1E9] border-r border-[#383A35] p-6 shrink-0">
        <div className="space-y-8">
          {/* Brand */}
          <div>
            <Link href="/" className="group block">
              <span className="font-editorial text-2xl tracking-[0.16em] font-medium text-[#F5F1E9] uppercase block group-hover:text-[#C4A476] transition-colors">
                Keina Mark
              </span>
              <span className="text-[9px] tracking-[0.35em] text-[#C4A476] uppercase block font-sans -mt-0.5">
                Studio Admin
              </span>
            </Link>
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#F5F1E9]/10 text-[#C4A476] text-[10px] font-mono">
              <ShieldCheck className="w-3 h-3" />
              <span>Painel Autoral</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-sans uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-[#C4A476] text-[#242522] font-bold shadow-2xs"
                      : "text-[#F5F1E9]/80 hover:bg-[#383A35] hover:text-[#F5F1E9]"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-[#383A35] space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-sans text-[#F5F1E9]/70 hover:text-[#C4A476] transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>Ver Loja Virtual</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-sans text-red-300 hover:text-red-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Mobile Header */}
        <header className="lg:hidden bg-[#242522] text-[#F5F1E9] p-4 flex items-center justify-between border-b border-[#383A35]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 text-[#F5F1E9]"
              aria-label="Abrir menu admin"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-editorial text-lg tracking-wider">Keina Mark Admin</span>
          </div>
          <Link href="/" className="text-xs text-[#C4A476] uppercase tracking-wider flex items-center gap-1 font-sans">
            <Store className="w-3.5 h-3.5" />
            <span>Loja</span>
          </Link>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#1A1B18] text-[#F5F1E9] p-4 border-b border-[#383A35] space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 text-xs font-sans uppercase tracking-wider ${
                  pathname === item.href ? "bg-[#C4A476] text-[#242522] font-bold" : "text-[#F5F1E9]/80"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
