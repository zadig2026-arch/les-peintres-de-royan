import fs from "fs";
import path from "path";
import type { MetadataRoute } from "next";
import { getArtisteSlugs, getExpositionSlugs } from "@/lib/content";

export const dynamic = "force-static";

function mtime(relative: string): Date {
  try {
    return fs.statSync(
      path.join(/* turbopackIgnore: true */ process.cwd(), "content", relative)
    ).mtime;
  } catch {
    return new Date();
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://lespeintresderoyan.fr";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1, lastModified: now },
    { url: `${base}/artistes`, changeFrequency: "monthly", priority: 0.9, lastModified: now },
    { url: `${base}/expositions`, changeFrequency: "weekly", priority: 0.9, lastModified: now },
    { url: `${base}/oeuvres`, changeFrequency: "monthly", priority: 0.8, lastModified: now },
    { url: `${base}/le-collectif`, changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: `${base}/nous-rejoindre`, changeFrequency: "yearly", priority: 0.5, lastModified: now },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.5, lastModified: now },
    { url: `${base}/mentions-legales`, changeFrequency: "yearly", priority: 0.2, lastModified: now },
    { url: `${base}/politique-confidentialite`, changeFrequency: "yearly", priority: 0.2, lastModified: now },
  ];

  const artistes: MetadataRoute.Sitemap = getArtisteSlugs().map((slug) => ({
    url: `${base}/artistes/${slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: mtime(`artistes/${slug}.md`),
  }));

  const expositions: MetadataRoute.Sitemap = getExpositionSlugs().map((slug) => ({
    url: `${base}/expositions/${slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: mtime(`expositions/${slug}.md`),
  }));

  return [...staticPages, ...artistes, ...expositions];
}
