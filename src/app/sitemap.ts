import type { MetadataRoute } from "next";
import { i18n } from "@/lib/i18n/config";

const baseUrl = "https://astrotech.com.tr";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/careers", "/case-studies", "/case-studies/raw-materials-factory", "/case-studies/ceramic-tile-production"];

  const sitemap: MetadataRoute.Sitemap = [];

  for (const locale of i18n.locales) {
    for (const route of routes) {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            i18n.locales.map((l) => [l, `${baseUrl}/${l}${route}`])
          ),
        },
      });
    }
  }

  return sitemap;
}
