import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { EditorialEssence } from "@/components/home/EditorialEssence";
import { CuratedCollection } from "@/components/home/CuratedCollection";
import { getCategories, getCollections, getProducts, getStoreSettings } from "@/lib/db";

export default async function HomePage() {
  const [categories, collections, products, settings] = await Promise.all([
    getCategories(),
    getCollections(),
    getProducts({ status: "published" }),
    getStoreSettings(),
  ]);

  const featuredCollection = collections.find((c) => c.is_featured) || collections[0];

  return (
    <div className="min-h-screen flex flex-col bg-marfim text-grafite">
      <Header />
      
      <main className="flex-1">
        <Hero
          title={settings.hero_title}
          subtitle={settings.hero_subtitle}
          ctaText={settings.hero_cta_text}
        />

        <CategoriesSection categories={categories} />

        <FeaturedProducts products={products} />

        <EditorialEssence />

        {featuredCollection && (
          <CuratedCollection
            collection={featuredCollection}
            products={products}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
