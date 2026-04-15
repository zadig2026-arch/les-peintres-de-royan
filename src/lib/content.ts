import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  Artiste,
  Oeuvre,
  OeuvreFichier,
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

// --- Oeuvres séparées (content/oeuvres/*.md) ---

function getOeuvresFichiers(): OeuvreFichier[] {
  return readMarkdownFiles<OeuvreFichier>("oeuvres");
}

function mergeOeuvresIntoArtiste(artiste: Artiste, oeuvresFichiers: OeuvreFichier[]): Artiste {
  const extra = oeuvresFichiers
    .filter((o) => o.artiste_slug === artiste.slug)
    .map(({ artiste_slug, slug, ...oeuvre }) => oeuvre);
  return { ...artiste, oeuvres: [...artiste.oeuvres, ...extra] };
}

// --- Artistes ---

export function getAllArtistes(): Artiste[] {
  const oeuvresFichiers = getOeuvresFichiers();
  return readMarkdownFiles<Artiste>("artistes")
    .filter((a) => a.visible)
    .map((a) => mergeOeuvresIntoArtiste(a, oeuvresFichiers))
    .sort((a, b) => a.ordre - b.ordre);
}

export function getArtisteBySlug(slug: string): Artiste | undefined {
  const artiste = readMarkdownFiles<Artiste>("artistes").find((a) => a.slug === slug);
  if (!artiste) return undefined;
  return mergeOeuvresIntoArtiste(artiste, getOeuvresFichiers());
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

// --- Regroupement automatique par série ---

export interface OeuvreSection {
  label: string | null;
  oeuvres: Oeuvre[];
}

/**
 * Extrait le préfixe d'un titre en retirant les chiffres/numéros finaux.
 * "Arbre 1" → "Arbre", "Les Lutteurs 2" → "Les Lutteurs", "Zadig 3" → "Zadig"
 * Ignore les titres génériques ("Oeuvre 1") et les titres sans numéro.
 */
function extrairePrefixe(titre: string): string | null {
  // Ignorer les titres génériques
  if (/^Oeuvre \d+$/i.test(titre)) return null;
  // Extraire le préfixe si le titre finit par un espace + chiffre(s)
  const match = titre.match(/^(.+?)\s+\d+$/);
  return match ? match[1] : null;
}

export function grouperOeuvresParSerie(oeuvres: Oeuvre[]): OeuvreSection[] {
  const seriesExplicites = new Map<string, Oeuvre[]>();
  const sansSerieExplicite: Oeuvre[] = [];

  // 1. Séparer les oeuvres avec série explicite
  oeuvres.forEach((o) => {
    if (o.serie) {
      if (!seriesExplicites.has(o.serie)) seriesExplicites.set(o.serie, []);
      seriesExplicites.get(o.serie)!.push(o);
    } else {
      sansSerieExplicite.push(o);
    }
  });

  // 2. Auto-détecter les séries parmi les oeuvres restantes
  const prefixCount = new Map<string, number>();
  sansSerieExplicite.forEach((o) => {
    const p = extrairePrefixe(o.titre);
    if (p) prefixCount.set(p, (prefixCount.get(p) ?? 0) + 1);
  });

  const seriesAuto = new Map<string, Oeuvre[]>();
  const vraiSansSerie: Oeuvre[] = [];

  sansSerieExplicite.forEach((o) => {
    const p = extrairePrefixe(o.titre);
    if (p && (prefixCount.get(p) ?? 0) >= 2) {
      if (!seriesAuto.has(p)) seriesAuto.set(p, []);
      seriesAuto.get(p)!.push(o);
    } else {
      vraiSansSerie.push(o);
    }
  });

  // 3. Trier dans chaque série
  const sortSerie = (oeuvres: Oeuvre[]) =>
    oeuvres.sort((a, b) => (a.ordre_serie ?? 99) - (b.ordre_serie ?? 99));

  // 4. Assembler les sections
  const sections: OeuvreSection[] = [];
  seriesExplicites.forEach((items, label) => sections.push({ label, oeuvres: sortSerie(items) }));
  seriesAuto.forEach((items, label) => sections.push({ label, oeuvres: sortSerie(items) }));
  if (vraiSansSerie.length > 0) sections.push({ label: null, oeuvres: vraiSansSerie });

  return sections;
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
