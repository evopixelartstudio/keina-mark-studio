import { MetadataRoute } from "next";
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COLLECTIONS } from "@/lib/initial-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://keinamark.com.br";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/loja`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/carrinho`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/politicas`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = INITIAL_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/categoria/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = INITIAL_COLLECTIONS.map((col) => ({
    url: `${baseUrl}/colecao/${col.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = INITIAL_PRODUCTS.map((prod) => ({
    url: `${baseUrl}/produto/${prod.slug}`,
    lastModified: new Date(prod.updated_at || prod.created_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...collectionRoutes,
    ...productRoutes,
  ];
}
