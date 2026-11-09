import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-grafite text-marfim border-t border-grafite-700/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand Manifesto column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-2xl tracking-[0.18em] font-medium text-marfim uppercase block">
                Keina Mark
              </span>
              <span className="text-[10px] tracking-[0.35em] text-areia uppercase block font-sans -mt-1">
                Studio
              </span>
            </Link>
            <p className="text-xs text-marfim-200/70 font-sans leading-relaxed max-w-sm">
              Design contemporâneo com identidade, calor e referências sutis à Amazônia. Peças autorais que valorizam a matéria-prima, a criatividade e a exclusividade.
            </p>
            <p className="text-[11px] text-areia/80 font-sans">
              Curadoria de moda, mobiliário, acessórios e objetos.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-areia">
              Categorias
            </h4>
            <ul className="space-y-2 text-xs text-marfim-200/80 font-sans">
              <li>
                <Link href="/categoria/moda" className="hover:text-areia transition-colors">
                  Moda
                </Link>
              </li>
              <li>
                <Link href="/categoria/acessorios" className="hover:text-areia transition-colors">
                  Acessórios
                </Link>
              </li>
              <li>
                <Link href="/categoria/mobiliario" className="hover:text-areia transition-colors">
                  Mobiliário
                </Link>
              </li>
              <li>
                <Link href="/categoria/objetos-e-presentes" className="hover:text-areia transition-colors">
                  Objetos e Presentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutional */}
          <div className="space-y-3">
            <h4 className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-areia">
              Institucional
            </h4>
            <ul className="space-y-2 text-xs text-marfim-200/80 font-sans">
              <li>
                <Link href="/sobre" className="hover:text-areia transition-colors">
                  A Essência da Marca
                </Link>
              </li>
              <li>
                <Link href="/politica-de-privacidade" className="hover:text-areia transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos-de-uso" className="hover:text-areia transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/minha-conta" className="hover:text-areia transition-colors">
                  Minha Conta
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Social */}
          <div className="space-y-3">
            <h4 className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-areia">
              Atendimento
            </h4>
            <p className="text-xs text-marfim-200/70 font-sans leading-relaxed">
              Dúvidas sobre peças, cotação de frete especial ou encomendas sob medida:
            </p>
            <p className="text-xs font-sans text-areia hover:underline">
              contato@keinamark.com.br
            </p>
            <div className="pt-2">
              <span className="text-[11px] text-marfim-200/50 block font-sans">
                Instagram Oficial:
              </span>
              <span className="text-xs font-sans text-marfim-200/80">
                @keinamarkstudio
              </span>
            </div>
          </div>
        </div>

        {/* Legal bottom bar */}
        <div className="mt-14 pt-8 border-t border-grafite-700/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-marfim-200/50 font-sans">
          <p>© {new Date().getFullYear()} Keina Mark Studio. Todos os direitos reservados.</p>
          <p className="text-center sm:text-right">
            Etapa de apresentação visual e curadoria demonstrativa.
          </p>
        </div>
      </div>
    </footer>
  );
}
