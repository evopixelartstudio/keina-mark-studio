import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, Compass, Sparkles, Feather } from "lucide-react";

export const metadata: Metadata = {
  title: "A Essência da Marca | Keina Mark Studio",
  description:
    "Conheça a história e o propósito da Keina Mark Studio: design autoral contemporâneo com identidade brasileira e raízes amazônicas.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-marfim text-grafite">
      <Header />

      <main className="flex-1 py-14 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-sans uppercase tracking-[0.25em] text-couro font-medium block">
              Manifesto & Identidade
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-grafite leading-tight">
              Design com Origem. Peças com Identidade.
            </h1>
            <p className="text-sm sm:text-base text-grafite/70 font-sans leading-relaxed pt-2">
              Uma curadoria autoral de objetos, vestuário e mobiliário concebidos para quem aprecia o tempo, o calor das matérias-primas e a originalidade da forma.
            </p>
          </div>

          {/* Large Hero Photography */}
          <div className="relative aspect-16/9 w-full bg-marfim-200 border border-grafite/10 shadow-lg overflow-hidden">
            <Image
              src="/products/banco-rustico-madeira-metal.png"
              alt="Cadeira artesanal Keina Mark Studio em madeira e metal"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>

          {/* Narrative Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start pt-6">
            <div className="md:col-span-4 space-y-4">
              <span className="text-xs font-sans uppercase tracking-[0.2em] text-grafite/50 block font-semibold">
                Origem & Olhar
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-grafite font-normal">
                O encontro entre o traço contemporâneo e a alma da floresta.
              </h2>
            </div>

            <div className="md:col-span-8 space-y-6 text-sm text-grafite/80 font-sans leading-relaxed">
              <p>
                A <strong>Keina Mark Studio</strong> nasce da vontade de expressar o Brasil profundo através de uma linguagem contemporânea e cosmopolita. A marca rejeita o artesanato caricato, turístico ou excessivamente folclórico: aqui, a Amazônia surge com sutileza, em suas geometrias primordiais, na rusticidade da madeira de manejo, nas tonalidades terrosas e no grafite mineral.
              </p>
              <p>
                Nossa produção abrange peças de mobiliário escultórico, vestuário de algodão nobre com diagramas autorais, bolsas estruturadas e objetos singulares para o cotidiano. Cada item é desenvolvido como uma presença afetuosa e duradoura no espaço ou no corpo.
              </p>
              <p className="text-xs text-grafite/50 italic border-l-2 border-couro/40 pl-3">
                * Informações institucionais provisórias elaboradas para o lançamento do projeto, sujeitas à aprovação e complementação biográfica pela criadora Keina Mark.
              </p>
            </div>
          </div>

          {/* Principles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-grafite/10">
            <div className="bg-marfim-50 p-6 border border-grafite/10 space-y-2">
              <span className="text-couro text-xs uppercase tracking-wider font-semibold font-sans block">
                01. Sofisticação Silenciosa
              </span>
              <h3 className="font-serif text-xl text-grafite">Espaço e Respiração</h3>
              <p className="text-xs text-grafite/70 font-sans leading-relaxed">
                Design minimalista onde cada elemento possui razão de ser. Sem excesso de ruídos gráficos ou artificialismos comerciais.
              </p>
            </div>

            <div className="bg-marfim-50 p-6 border border-grafite/10 space-y-2">
              <span className="text-couro text-xs uppercase tracking-wider font-semibold font-sans block">
                02. Matéria Nobre
              </span>
              <h3 className="font-serif text-xl text-grafite">Madeira, Metal e Fibras</h3>
              <p className="text-xs text-grafite/70 font-sans leading-relaxed">
                Respeito às texturas verdadeiras dos materiais. O aço carbono dialoga harmoniosamente com pranchas de madeira rústica e lona técnica.
              </p>
            </div>

            <div className="bg-marfim-50 p-6 border border-grafite/10 space-y-2">
              <span className="text-couro text-xs uppercase tracking-wider font-semibold font-sans block">
                03. Exclusividade Real
              </span>
              <h3 className="font-serif text-xl text-grafite">Tiragens Limitadas</h3>
              <p className="text-xs text-grafite/70 font-sans leading-relaxed">
                Peças numeradas ou sob encomenda que valorizam o processo manual e o tempo necessário para um acabamento sem concessões.
              </p>
            </div>
          </div>

          {/* Call to action */}
          <div className="pt-8 text-center">
            <Link
              href="/loja"
              className="inline-flex items-center gap-2 px-8 py-4 bg-grafite text-marfim text-xs font-sans font-semibold uppercase tracking-[0.2em] hover:bg-couro transition-colors shadow-sm"
            >
              <span>Explorar o Catálogo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
