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
  const inline = artiste.oeuvres ?? [];
  return {
    ...artiste,
    series_ordre: normalizeSeriesOrdre(artiste.series_ordre),
    oeuvres: [...inline, ...extra],
  };
}

// Sveltia stocke les listes typées comme [{nom: "Foo"}, ...] ; on accepte aussi
// le format simple (string[]) pour les fichiers édités à la main.
function normalizeSeriesOrdre(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const normalized = value
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && "nom" in item) {
        const v = (item as { nom?: unknown }).nom;
        return typeof v === "string" ? v : null;
      }
      return null;
    })
    .filter((v): v is string => typeof v === "string" && v.length > 0);
  return normalized.length > 0 ? normalized : undefined;
}

// --- Artistes ---

export function getAllArtistes(): Artiste[] {
  const oeuvresFichiers = getOeuvresFichiers();
  return readMarkdownFiles<Artiste>("artistes")
    .filter((a) => a.visible)
    .map((a) => mergeOeuvresIntoArtiste(a, oeuvresFichiers))
    .sort((a, b) => {
      const ordreA = a.ordre ?? 99;
      const ordreB = b.ordre ?? 99;
      if (ordreA !== ordreB) return ordreA - ordreB;
      return a.nom.localeCompare(b.nom, "fr", { sensitivity: "base" });
    });
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

export function grouperOeuvresParSerie(
  oeuvres: Oeuvre[],
  seriesOrdre?: string[],
): OeuvreSection[] {
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
    [...oeuvres].sort((a, b) => (a.ordre_serie ?? 99) - (b.ordre_serie ?? 99));

  // 4. Fusionner toutes les séries (explicites + auto) dans une map unique
  const toutesSeries = new Map<string, Oeuvre[]>();
  seriesExplicites.forEach((items, label) => toutesSeries.set(label, sortSerie(items)));
  seriesAuto.forEach((items, label) => toutesSeries.set(label, sortSerie(items)));

  // 5. Ordonner les sections : d'abord celles listées dans seriesOrdre,
  // puis le reste par ordre alphabétique. Les œuvres sans série toujours en dernier.
  const sections: OeuvreSection[] = [];
  const labelsRestants = new Set(toutesSeries.keys());

  if (seriesOrdre && seriesOrdre.length > 0) {
    seriesOrdre.forEach((label) => {
      const items = toutesSeries.get(label);
      if (items) {
        sections.push({ label, oeuvres: items });
        labelsRestants.delete(label);
      }
    });
  }

  Array.from(labelsRestants)
    .sort((a, b) => a.localeCompare(b, "fr"))
    .forEach((label) => sections.push({ label, oeuvres: toutesSeries.get(label)! }));

  if (vraiSansSerie.length > 0) sections.push({ label: null, oeuvres: vraiSansSerie });

  return sections;
}

// --- Œuvres mises en avant (page d'accueil) ---

export interface FeaturedOeuvre {
  oeuvre: Oeuvre;
  artiste: Pick<Artiste, "nom" | "slug">;
}

export function getFeaturedOeuvres(limit = 8): FeaturedOeuvre[] {
  const artistes = getAllArtistes();
  const featured: FeaturedOeuvre[] = [];

  for (const artiste of artistes) {
    for (const oeuvre of artiste.oeuvres) {
      if (oeuvre.mise_en_avant) {
        featured.push({ oeuvre, artiste: { nom: artiste.nom, slug: artiste.slug } });
      }
    }
  }

  if (featured.length > 0) return featured.slice(0, limit);

  // Fallback : les `limit` œuvres les plus récemment ajoutées (par mtime fichier).
  const oeuvresDir = path.join(contentDir, "oeuvres");
  if (!fs.existsSync(oeuvresDir)) return [];
  const artisteBySlug = new Map(artistes.map((a) => [a.slug, a] as const));
  const entries = fs
    .readdirSync(oeuvresDir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const fullPath = path.join(oeuvresDir, file);
      const raw = fs.readFileSync(fullPath, "utf-8");
      const { data } = matter(raw);
      return {
        data: data as OeuvreFichier,
        mtime: fs.statSync(fullPath).mtimeMs,
      };
    })
    .filter((e) => artisteBySlug.has(e.data.artiste_slug))
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, limit);

  return entries.map(({ data }) => {
    const artiste = artisteBySlug.get(data.artiste_slug)!;
    const { artiste_slug, slug, ...oeuvre } = data;
    return { oeuvre, artiste: { nom: artiste.nom, slug: artiste.slug } };
  });
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
