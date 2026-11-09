'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, User, Menu, X, ShieldAlert } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { cartTotalCount, currentUser } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Novidades', href: '/loja' },
    { label: 'Moda', href: '/categoria/moda' },
    { label: 'Acessórios', href: '/categoria/acessorios' },
    { label: 'Mobiliário', href: '/categoria/mobiliario' },
    { label: 'Objetos', href: '/categoria/objetos-e-presentes' },
    { label: 'Nossa Essência', href: '/sobre' },
  ];

  const isAdminRoute = pathname.startsWith('/admin');
  if (isAdminRoute) return null;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-[#F5F1E9]/95 backdrop-blur-md shadow-xs border-[#E8E2D5]'
          : 'bg-[#F5F1E9] border-transparent'
      }`}
    >
      {/* Top micro bar for discreet institutional message */}
      <div className="bg-[#242522] text-[#F5F1E9] text-xs py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center font-mono">
          <span className="text-[11px] tracking-wider uppercase opacity-90">
            Keina Mark Studio &middot; Design autoral contemporâneo &middot; Manaus / Brasil
          </span>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile hamburger */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-[#242522] hover:text-[#87563B] transition-colors focus:outline-none"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start">
            <Link href="/" className="group flex flex-col items-center lg:items-start">
              <span className="font-editorial text-2xl sm:text-3xl tracking-[0.18em] text-[#242522] uppercase font-light group-hover:text-[#87563B] transition-colors">
                Keina Mark
              </span>
              <span className="text-[9px] tracking-[0.45em] text-[#70775E] uppercase -mt-1 font-sans font-medium">
                Studio
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[13px] tracking-wider uppercase font-medium transition-colors relative py-1 ${
                    isActive
                      ? 'text-[#87563B] font-semibold'
                      : 'text-[#242522]/80 hover:text-[#242522]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#87563B]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#242522] hover:text-[#87563B] transition-colors"
              aria-label="Buscar produtos"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Account Link */}
            <Link
              href={currentUser ? '/minha-conta' : '/entrar'}
              className="p-2 text-[#242522] hover:text-[#87563B] transition-colors relative"
              aria-label="Minha Conta"
            >
              <User className="w-5 h-5 stroke-[1.5]" />
              {currentUser && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#70775E]" />
              )}
            </Link>

            {/* Cart Link with Badge */}
            <Link
              href="/carrinho"
              className="p-2 text-[#242522] hover:text-[#87563B] transition-colors relative group"
              aria-label="Carrinho"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#87563B] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartTotalCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Search Overlay Drawer */}
      {searchOpen && (
        <div className="border-t border-[#E8E2D5] bg-[#FAF7F2] py-4 px-4 sm:px-8 shadow-xs animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <Search className="w-5 h-5 text-[#6C6F65]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  window.location.href = `/loja?q=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
              placeholder="O que você está procurando? Ex: bolsa, cadeira, camiseta, kit..."
              className="flex-1 bg-transparent border-none text-base text-[#242522] placeholder-[#6C6F65]/70 focus:outline-none font-sans"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#6C6F65] hover:text-[#242522] uppercase tracking-wider"
              >
                Limpar
              </button>
            )}
            <Link
              href={`/loja?q=${encodeURIComponent(searchQuery.trim())}`}
              className="text-xs font-semibold uppercase tracking-widest px-3 py-1.5 bg-[#242522] text-[#F5F1E9] hover:bg-[#87563B] transition-colors"
            >
              Buscar
            </Link>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[110px] z-40 bg-[#F5F1E9] border-t border-[#E8E2D5] px-6 py-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            <p className="text-[11px] tracking-[0.25em] text-[#70775E] uppercase font-semibold">
              Navegação
            </p>
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xl font-editorial tracking-wide transition-colors ${
                    pathname === link.href ? 'text-[#87563B] font-medium' : 'text-[#242522]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-[#E8E2D5] pt-6 space-y-4 text-sm">
            <Link
              href="/minha-conta"
              className="flex items-center gap-3 text-[#242522] hover:text-[#87563B]"
            >
              <User className="w-4 h-4" />
              <span>{currentUser ? `Minha Conta (${currentUser.first_name})` : 'Entrar / Cadastrar'}</span>
            </Link>
            <Link
              href="/carrinho"
              className="flex items-center gap-3 text-[#242522] hover:text-[#87563B]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Carrinho ({cartTotalCount} itens)</span>
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-3 text-[#87563B] font-medium pt-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Painel Administrativo da Loja</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
