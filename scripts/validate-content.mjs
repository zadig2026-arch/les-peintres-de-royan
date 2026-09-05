// Valide le contenu Markdown/YAML avant déploiement.
// Attrape les erreurs silencieuses que le build Next ne détecte pas :
//   - slugs d'artistes ou d'expositions en double (collision de route)
//   - œuvres rattachées à un artiste_slug inexistant (œuvre invisible)
//   - images référencées dans le frontmatter mais absentes de public/
//
// Lancement : `npm run validate` (ou `node scripts/validate-content.mjs`).
// Sortie non nulle si au moins une erreur → fait échouer la CI.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content");
const PUBLIC = path.join(ROOT, "public");

const errors = [];
const err = (msg) => errors.push(msg);

function readCollection(name) {
  const dir = path.join(CONTENT, name);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => ({
      file: `content/${name}/${file}`,
      data: matter(fs.readFileSync(path.join(dir, file), "utf-8")).data,
    }));
}

// Récupère récursivement toutes les valeurs commençant par /images/
function collectImages(value, out) {
  if (typeof value === "string") {
    if (value.startsWith("/images/")) out.add(value);
  } else if (Array.isArray(value)) {
    value.forEach((v) => collectImages(v, out));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((v) => collectImages(v, out));
  }
}

const artistes = readCollection("artistes");
const oeuvres = readCollection("oeuvres");
const expositions = readCollection("expositions");
const pages = readCollection("pages");

// 1. Slugs d'artistes uniques
const artisteSlugs = new Map();
for (const { file, data } of artistes) {
  if (!data.slug) {
    err(`${file} : champ "slug" manquant.`);
    continue;
  }
  if (artisteSlugs.has(data.slug)) {
    err(`Slug d'artiste en double "${data.slug}" : ${artisteSlugs.get(data.slug)} et ${file}.`);
  } else {
    artisteSlugs.set(data.slug, file);
  }
}

// 2. Slugs d'expositions uniques
const expoSlugs = new Map();
for (const { file, data } of expositions) {
  if (!data.slug) {
    err(`${file} : champ "slug" manquant.`);
    continue;
  }
  if (expoSlugs.has(data.slug)) {
    err(`Slug d'exposition en double "${data.slug}" : ${expoSlugs.get(data.slug)} et ${file}.`);
  } else {
    expoSlugs.set(data.slug, file);
  }
}

// 2b. Slugs en minuscules ASCII (un accent ou une espace = page 404 en prod)
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
for (const { file, data } of [...artistes, ...expositions]) {
  if (data.slug && !SLUG_RE.test(data.slug)) {
    err(`${file} : slug "${data.slug}" invalide (minuscules, chiffres et tirets uniquement, sans accent).`);
  }
}

// 3. Chaque œuvre pointe vers un artiste existant
for (const { file, data } of oeuvres) {
  if (!data.artiste_slug) {
    err(`${file} : champ "artiste_slug" manquant.`);
  } else if (!artisteSlugs.has(data.artiste_slug)) {
    err(`${file} : artiste_slug "${data.artiste_slug}" ne correspond à aucun artiste (œuvre invisible).`);
  }
}

// 4. Toutes les images référencées existent
const imageRefs = new Set();
for (const { data } of [...artistes, ...oeuvres, ...expositions, ...pages]) {
  collectImages(data, imageRefs);
}
for (const ref of imageRefs) {
  const exists =
    fs.existsSync(path.join(PUBLIC, ref)) ||
    fs.existsSync(path.join(PUBLIC, decodeURIComponent(ref)));
  if (!exists) err(`Image introuvable : ${ref}`);
}

// Rapport
const counts = `${artistes.length} artistes, ${oeuvres.length} œuvres, ${expositions.length} expositions, ${imageRefs.size} images référencées`;
if (errors.length === 0) {
  console.log(`✓ Contenu valide (${counts}).`);
  process.exit(0);
}
console.error(`✗ ${errors.length} erreur(s) de contenu (${counts}) :\n`);
errors.forEach((e) => console.error(`  • ${e}`));
process.exit(1);
