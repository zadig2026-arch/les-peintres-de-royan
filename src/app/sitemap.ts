import type { MetadataRoute } from "next";
import { getArtisteSlugs, getExpositionSlugs } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://lespeintresderoyan.fr";

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/artistes`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/expositions`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/oeuvres`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/le-collectif`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/nous-rejoindre`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const artistes: MetadataRoute.Sitemap = getArtisteSlugs().map((slug) => ({
    url: `${base}/artistes/${slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const expositions: MetadataRoute.Sitemap = getExpositionSlugs().map(
    (slug) => ({
      url: `${base}/expositions/${slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  return [...staticPages, ...artistes, ...expositions];
}
