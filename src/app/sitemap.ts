import type { MetadataRoute } from "next";
import { getArtisteSlugs, getExpositionSlugs } from "@/lib/content";

const BASE = "https://lespeintresderoyan.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/le-collectif",
    "/artistes",
    "/expositions",
    "/nous-rejoindre",
    "/contact",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1.0 : 0.8,
  }));

  const artistes = getArtisteSlugs().map((slug) => ({
    url: `${BASE}/artistes/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const expositions = getExpositionSlugs().map((slug) => ({
    url: `${BASE}/expositions/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...artistes, ...expositions];
}
