import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  Artiste,
  Exposition,
  PageAccueil,
  PageCollectif,
  PageRejoindre,
  PageContact,
} from "./types";

const contentDir = path.join(process.cwd(), "content");

function readMarkdownFiles<T>(dir: string): T[] {
  const fullPath = path.join(contentDir, dir);
  if (!fs.existsSync(fullPath)) return [];
  const files = fs.readdirSync(fullPath).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(fullPath, file), "utf-8");
    const { data } = matter(raw);
    return data as T;
  });
}

function readSingleFile<T>(filePath: string): T {
  const fullPath = path.join(contentDir, filePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data } = matter(raw);
  return data as T;
}

// --- Artistes ---

export function getAllArtistes(): Artiste[] {
  return readMarkdownFiles<Artiste>("artistes")
    .filter((a) => a.visible)
    .sort((a, b) => a.ordre - b.ordre);
}

export function getArtisteBySlug(slug: string): Artiste | undefined {
  return readMarkdownFiles<Artiste>("artistes").find((a) => a.slug === slug);
}

export function getArtisteSlugs(): string[] {
  return getAllArtistes().map((a) => a.slug);
}

// --- Expositions ---

function computeStatut(expo: Exposition): Exposition["statut"] {
  const now = new Date();
  const debut = new Date(expo.date_debut);
  const fin = new Date(expo.date_fin);
  if (now < debut) return "a-venir";
  if (now >= debut && now <= fin) return "en-cours";
  return "passee";
}

export function getAllExpositions(): Exposition[] {
  return readMarkdownFiles<Exposition>("expositions")
    .filter((e) => e.visible)
    .map((e) => ({ ...e, statut: computeStatut(e) }))
    .sort(
      (a, b) =>
        new Date(b.date_debut).getTime() - new Date(a.date_debut).getTime()
    );
}

export function getExpositionBySlug(slug: string): Exposition | undefined {
  const expo = readMarkdownFiles<Exposition>("expositions").find(
    (e) => e.slug === slug
  );
  if (!expo) return undefined;
  return { ...expo, statut: computeStatut(expo) };
}

export function getExpositionSlugs(): string[] {
  return getAllExpositions().map((e) => e.slug);
}

export function getExpositionsActuelles(): Exposition[] {
  return getAllExpositions()
    .filter((e) => e.statut === "en-cours" || e.statut === "a-venir")
    .sort(
      (a, b) =>
        new Date(a.date_debut).getTime() - new Date(b.date_debut).getTime()
    );
}

export function getExpositionsPassees(): Exposition[] {
  return getAllExpositions().filter((e) => e.statut === "passee");
}

// --- Pages ---

export function getPageAccueil(): PageAccueil {
  return readSingleFile<PageAccueil>("pages/accueil.md");
}

export function getPageCollectif(): PageCollectif {
  return readSingleFile<PageCollectif>("pages/collectif.md");
}

export function getPageRejoindre(): PageRejoindre {
  return readSingleFile<PageRejoindre>("pages/nous-rejoindre.md");
}

export function getPageContact(): PageContact {
  return readSingleFile<PageContact>("pages/contact.md");
}
