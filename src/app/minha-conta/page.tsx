'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useStore } from '@/context/StoreContext';
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  Shield, 
  LogOut, 
  Plus, 
  Trash2, 
  Clock 
} from 'lucide-react';

export default function MyAccountPage() {
  const router = useRouter();
  const { 
    currentUser, 
    logout, 
    addresses, 
    addAddress, 
    setDefaultAddress, 
    deleteAddress,
    cartTotalCount 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders'>('profile');

  // New address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrCep, setAddrCep] = useState('');
  const [addrRecipient, setAddrRecipient] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrNumber, setAddrNumber] = useState('');
  const [addrComplement, setAddrComplement] = useState('');
  const [addrNeighborhood, setAddrNeighborhood] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F1E9]">
        <Header />
        <main className="flex-1 flex items-center justify-center p-8 text-center">
          <div className="space-y-4 max-w-md bg-[#FAF7F2] p-8 border border-[#E8E2D5]">
            <h1 className="font-editorial text-3xl text-[#242522]">Acesso Restrito</h1>
            <p className="text-xs text-[#242522]/70 leading-relaxed">
              Você precisa estar autenticado para acessar sua conta pessoal.
            </p>
            <Link
              href="/entrar"
              className="inline-block bg-[#242522] text-[#F5F1E9] px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#87563B] transition-colors"
            >
              Entrar ou Cadastrar
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleCepLookup = async (value: string) => {
    const clean = value.replace(/\D/g, '');
    setAddrCep(value);
    if (clean.length === 8) {
      setCepLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setAddrStreet(data.logradouro || '');
          setAddrNeighborhood(data.bairro || '');
          setAddrCity(data.localidade || '');
          setAddrState(data.uf || '');
        }
      } catch (err) {
        console.warn('ViaCEP err', err);
      } finally {
        setCepLoading(false);
      }
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrCep || !addrStreet || !addrNumber || !addrCity || !addrState) return;

    addAddress({
      recipient_name: addrRecipient || `${currentUser.first_name} ${currentUser.last_name}`,
      postal_code: addrCep,
      street: addrStreet,
      number: addrNumber,
      complement: addrComplement,
      neighborhood: addrNeighborhood,
      city: addrCity,
      state: addrState,
      is_default: addrIsDefault || addresses.length === 0,
    });

    // Reset form
    setShowAddressForm(false);
    setAddrCep('');
    setAddrRecipient('');
    setAddrStreet('');
    setAddrNumber('');
    setAddrComplement('');
    setAddrNeighborhood('');
    setAddrCity('');
    setAddrState('');
    setAddrIsDefault(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1E9]">
      <Header />

      <main className="flex-1 py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="border-b border-[#E8E2D5] pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#70775E] font-medium block mb-1">
                Área do Cliente
              </span>
              <h1 className="font-editorial text-4xl sm:text-5xl text-[#242522] font-light">
                Minha Conta
              </h1>
            </div>

            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#87563B] hover:text-[#242522] font-medium self-start sm:self-auto"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair da Conta</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Sidebar Navigation */}
            <div className="md:col-span-4 bg-[#FAF7F2] p-6 border border-[#E8E2D5] space-y-6">
              <div className="flex items-center gap-3 pb-6 border-b border-[#E8E2D5]">
                <div className="w-12 h-12 rounded-full bg-[#E8E2D5] flex items-center justify-center font-editorial text-xl text-[#242522]">
                  {currentUser.first_name[0]}
                </div>
                <div>
                  <h3 className="font-editorial text-lg text-[#242522]">
                    {currentUser.first_name} {currentUser.last_name}
                  </h3>
                  <p className="text-xs text-[#70775E] font-mono truncate max-w-[180px]">
                    {currentUser.email}
                  </p>
                </div>
              </div>

              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-3.5 py-2.5 text-xs uppercase tracking-wider font-medium flex items-center gap-3 transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-[#242522] text-[#F5F1E9]'
                      : 'text-[#242522] hover:bg-[#E8E2D5]'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Dados Pessoais</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full text-left px-3.5 py-2.5 text-xs uppercase tracking-wider font-medium flex items-center gap-3 transition-colors ${
                    activeTab === 'addresses'
                      ? 'bg-[#242522] text-[#F5F1E9]'
                      : 'text-[#242522] hover:bg-[#E8E2D5]'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Endereços de Entrega ({addresses.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-3.5 py-2.5 text-xs uppercase tracking-wider font-medium flex items-center gap-3 transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-[#242522] text-[#F5F1E9]'
                      : 'text-[#242522] hover:bg-[#E8E2D5]'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Histórico de Pedidos</span>
                </button>
              </nav>

              <div className="pt-4 border-t border-[#E8E2D5] space-y-3">
                <Link
                  href="/carrinho"
                  className="w-full flex items-center justify-between text-xs p-3 bg-[#F5F1E9] border border-[#E8E2D5] text-[#242522] hover:border-[#87563B]"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#70775E]" />
                    <span>Sacola Atual</span>
                  </span>
                  <span className="font-semibold text-[#87563B]">{cartTotalCount} itens</span>
                </Link>

                {currentUser.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="w-full flex items-center justify-center gap-2 text-xs p-2.5 bg-[#87563B] text-white font-medium uppercase tracking-wider hover:bg-[#68412B] transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Acessar Painel Admin</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="md:col-span-8 bg-[#FAF7F2] p-6 sm:p-8 border border-[#E8E2D5]">
              {/* TAB 1: Profile */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="border-b border-[#E8E2D5] pb-4">
                    <h2 className="font-editorial text-2xl text-[#242522]">Dados Cadastrais</h2>
                    <p className="text-xs text-[#70775E] mt-1">
                      Gerencie suas informações de contato e preferências no Studio.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="block text-[#70775E] uppercase tracking-wider">Nome Completo</span>
                      <p className="p-2.5 bg-[#F5F1E9] border border-[#E8E2D5] font-medium text-[#242522]">
                        {currentUser.first_name} {currentUser.last_name}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="block text-[#70775E] uppercase tracking-wider">E-mail</span>
                      <p className="p-2.5 bg-[#F5F1E9] border border-[#E8E2D5] font-mono text-[#242522]">
                        {currentUser.email}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="block text-[#70775E] uppercase tracking-wider">Perfil</span>
                      <p className="p-2.5 bg-[#F5F1E9] border border-[#E8E2D5] font-medium text-[#242522]">
                        {currentUser.role === 'admin' ? 'Administrador do Studio' : 'Cliente Cadastrado'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="block text-[#70775E] uppercase tracking-wider">Privacidade</span>
                      <p className="p-2.5 bg-[#F5F1E9] border border-[#E8E2D5] text-[#70775E]">
                        Dados protegidos conforme a LGPD
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Addresses */}
              {activeTab === 'addresses' && (
                <div className="space-y-6">
                  <div className="border-b border-[#E8E2D5] pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="font-editorial text-2xl text-[#242522]">Endereços de Envio</h2>
                      <p className="text-xs text-[#70775E] mt-1">
                        Cadastre locais de entrega para cálculo de frete e futuras compras.
                      </p>
                    </div>
                    {!showAddressForm && (
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(true)}
                        className="inline-flex items-center gap-1.5 bg-[#242522] text-[#F5F1E9] px-3.5 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-[#87563B] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Novo Endereço</span>
                      </button>
                    )}
                  </div>

                  {showAddressForm && (
                    <form onSubmit={handleSaveAddress} className="bg-[#F5F1E9] p-5 border border-[#DEC9A9] space-y-4 animate-in fade-in">
                      <h3 className="font-editorial text-lg text-[#242522]">Adicionar Endereço</h3>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#70775E] mb-1">
                            CEP {cepLoading && '(Buscando...)'}
                          </label>
                          <input
                            type="text"
                            value={addrCep}
                            onChange={(e) => handleCepLookup(e.target.value)}
                            placeholder="00000-000"
                            required
                            maxLength={9}
                            className="w-full bg-[#FAF7F2] border border-[#E8E2D5] p-2 text-xs focus:outline-none focus:border-[#87563B]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] uppercase tracking-wider text-[#70775E] mb-1">
                            Destinatário
                          </label>
                          <input
                            type="text"
                            value={addrRecipient}
                            onChange={(e) => setAddrRecipient(e.target.value)}
                            placeholder="Nome de quem vai receber"
                            className="w-full bg-[#FAF7F2] border border-[#E8E2D5] p-2 text-xs focus:outline-none focus:border-[#87563B]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] uppercase tracking-wider text-[#70775E] mb-1">
                            Logradouro / Rua / Avenida
                          </label>
                          <input
                            type="text"
                            value={addrStreet}
                            onChange={(e) => setAddrStreet(e.target.value)}
                            placeholder="Rua..."
                            required
                            className="w-full bg-[#FAF7F2] border border-[#E8E2D5] p-2 text-xs focus:outline-none focus:border-[#87563B]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#70775E] mb-1">
                            Número
                          </label>
                          <input
                            type="text"
                            value={addrNumber}
                            onChange={(e) => setAddrNumber(e.target.value)}
                            placeholder="Ex: 120"
                            required
                            className="w-full bg-[#FAF7F2] border border-[#E8E2D5] p-2 text-xs focus:outline-none focus:border-[#87563B]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#70775E] mb-1">
                            Complemento (opcional)
                          </label>
                          <input
                            type="text"
                            value={addrComplement}
                            onChange={(e) => setAddrComplement(e.target.value)}
                            placeholder="Apt, bloco..."
                            className="w-full bg-[#FAF7F2] border border-[#E8E2D5] p-2 text-xs focus:outline-none focus:border-[#87563B]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#70775E] mb-1">
                            Bairro
                          </label>
                          <input
                            type="text"
                            value={addrNeighborhood}
                            onChange={(e) => setAddrNeighborhood(e.target.value)}
                            placeholder="Bairro"
                            required
                            className="w-full bg-[#FAF7F2] border border-[#E8E2D5] p-2 text-xs focus:outline-none focus:border-[#87563B]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#70775E] mb-1">
                            Cidade / UF
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={addrCity}
                              onChange={(e) => setAddrCity(e.target.value)}
                              placeholder="Cidade"
                              required
                              className="w-3/4 bg-[#FAF7F2] border border-[#E8E2D5] p-2 text-xs focus:outline-none focus:border-[#87563B]"
                            />
                            <input
                              type="text"
                              value={addrState}
                              onChange={(e) => setAddrState(e.target.value)}
                              placeholder="UF"
                              required
                              maxLength={2}
                              className="w-1/4 bg-[#FAF7F2] border border-[#E8E2D5] p-2 text-xs text-center uppercase focus:outline-none focus:border-[#87563B]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="defaultAddr"
                          checked={addrIsDefault}
                          onChange={(e) => setAddrIsDefault(e.target.checked)}
                          className="rounded text-[#87563B]"
                        />
                        <label htmlFor="defaultAddr" className="text-xs text-[#242522]">
                          Definir como endereço principal de entrega
                        </label>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="px-4 py-2 text-xs uppercase tracking-wider text-[#6C6F65] hover:text-[#242522]"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="bg-[#242522] text-[#F5F1E9] px-5 py-2 text-xs uppercase tracking-wider font-semibold hover:bg-[#87563B]"
                        >
                          Salvar Endereço
                        </button>
                      </div>
                    </form>
                  )}

                  {addresses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`p-4 border relative flex flex-col justify-between ${
                            addr.is_default
                              ? 'bg-[#FAF7F2] border-[#87563B]'
                              : 'bg-[#F5F1E9] border-[#E8E2D5]'
                          }`}
                        >
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-sm text-[#242522]">
                                {addr.recipient_name}
                              </span>
                              {addr.is_default && (
                                <span className="bg-[#87563B] text-white text-[9px] uppercase tracking-wider px-2 py-0.5 font-semibold">
                                  Padrão
                                </span>
                              )}
                            </div>
                            <p className="text-[#242522]/80">
                              {addr.street}, {addr.number} {addr.complement && `— ${addr.complement}`}
                            </p>
                            <p className="text-[#242522]/80">
                              {addr.neighborhood} &middot; {addr.city} - {addr.state}
                            </p>
                            <p className="text-[#70775E] font-mono">CEP: {addr.postal_code}</p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-[#E8E2D5] flex items-center justify-between text-xs">
                            {!addr.is_default ? (
                              <button
                                type="button"
                                onClick={() => setDefaultAddress(addr.id)}
                                className="text-[#70775E] hover:text-[#87563B] font-medium"
                              >
                                Tornar Padrão
                              </button>
                            ) : (
                              <span className="text-[#70775E] italic text-[11px]">Endereço principal</span>
                            )}

                            <button
                              type="button"
                              onClick={() => deleteAddress(addr.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                              aria-label="Excluir endereço"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#70775E] py-4 text-center">
                      Nenhum endereço cadastrado até o momento.
                    </p>
                  )}
                </div>
              )}

              {/* TAB 3: Order History */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="border-b border-[#E8E2D5] pb-4">
                    <h2 className="font-editorial text-2xl text-[#242522]">Histórico de Pedidos</h2>
                    <p className="text-xs text-[#70775E] mt-1">
                      Acompanhe o status e rastreamento de suas aquisições.
                    </p>
                  </div>

                  <div className="p-10 text-center bg-[#F5F1E9] border border-[#E8E2D5] space-y-3">
                    <Clock className="w-8 h-8 text-[#70775E] mx-auto opacity-70" />
                    <h3 className="font-editorial text-xl text-[#242522]">
                      Nenhum pedido realizado ainda
                    </h3>
                    <p className="text-xs text-[#242522]/70 max-w-sm mx-auto leading-relaxed">
                      A loja virtual está em fase inaugural de catálogo e homologação. O checkout financeiro será disponibilizado em breve.
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/loja"
                        className="inline-block bg-[#242522] text-[#F5F1E9] px-6 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-[#87563B]"
                      >
                        Navegar pelo Catálogo
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
