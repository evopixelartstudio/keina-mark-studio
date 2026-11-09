import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://keinamark.com.br";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/minha-conta/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
