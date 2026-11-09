import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CatalogView } from "@/components/product/CatalogView";
import { getCategories, getProducts } from "@/lib/db";

export const metadata: Metadata = {
  title: "Loja & Catálogo Autoral",
  description:
    "Explore toda a curadoria de design da Keina Mark Studio: moda, acessórios, mobiliário e objetos autorais.",
};

export default async function LojaPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; q?: string }>;
}) {
  const { categoria, q } = await searchParams;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ status: "published" }),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-marfim text-grafite">
      <Header />

      <main className="flex-1 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header */}
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-sans uppercase tracking-[0.25em] text-couro font-medium block">
              Catálogo Oficial
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-light text-grafite">
              Loja Keina Mark Studio
            </h1>
            <p className="text-sm text-grafite/70 font-sans leading-relaxed">
              Objetos desenhados com personalidade e presença. Conheça as peças fotografadas em estúdio com detalhes e especificações técnicas completas.
            </p>
          </div>

          {/* Interactive Catalog View with Filters */}
          <CatalogView
            initialProducts={products}
            categories={categories}
            initialCategory={categoria}
            initialQuery={q}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
