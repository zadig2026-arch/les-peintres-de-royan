import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "images");
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 80;
const PNG_QUALITY = 80;
const SKIP_SIZE_BYTES = 350 * 1024;

// Miniatures WebP servies par les grilles (src/lib/img.ts construit les URLs).
// /images/<chemin>/<fichier> → /images/_thumbs/<chemin>/<fichier>.w<W>.webp
const THUMBS_DIR = path.join(ROOT, "_thumbs");
// Qualité dégressive : la 960 n'est affichée qu'à ~300-480px CSS (écrans retina),
// les artefacts y sont invisibles et le poids du repo reste contenu.
const THUMB_VARIANTS = [
  { width: 480, quality: 72 },
  { width: 960, quality: 62 },
];

const EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (full === THUMBS_DIR) continue; // les dérivés ne se recompressent pas
      yield* walk(full);
    } else if (entry.isFile() && EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      yield full;
    }
  }
}

function fmt(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function processFile(file) {
  const stat = await fs.stat(file);
  const ext = path.extname(file).toLowerCase();
  const input = await fs.readFile(file);
  const image = sharp(input, { failOn: "none" });
  const meta = await image.metadata();

  const needsResize = (meta.width ?? 0) > MAX_DIMENSION || (meta.height ?? 0) > MAX_DIMENSION;
  const needsRecompress = stat.size > SKIP_SIZE_BYTES;

  if (!needsResize && !needsRecompress) {
    return { file, skipped: true, before: stat.size, after: stat.size };
  }

  let pipeline = image.rotate();
  if (needsResize) {
    pipeline = pipeline.resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  if (ext === ".png") {
    pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9, palette: true });
  } else {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  }

  const output = await pipeline.toBuffer();

  if (output.length >= stat.size) {
    return { file, skipped: true, before: stat.size, after: stat.size, reason: "no-gain" };
  }

  await fs.writeFile(file, output);
  return { file, skipped: false, before: stat.size, after: output.length };
}

// Génère (si absentes ou plus vieilles que la source) les miniatures WebP
// d'un original. Retourne le nombre de fichiers écrits.
async function generateThumbs(file) {
  const rel = path.relative(ROOT, file);
  const srcStat = await fs.stat(file);
  let written = 0;
  for (const { width, quality } of THUMB_VARIANTS) {
    const out = path.join(THUMBS_DIR, `${rel}.w${width}.webp`);
    try {
      const outStat = await fs.stat(out);
      if (outStat.mtimeMs >= srcStat.mtimeMs) continue; // déjà à jour
    } catch {
      /* pas encore générée */
    }
    await fs.mkdir(path.dirname(out), { recursive: true });
    await sharp(await fs.readFile(file), { failOn: "none" })
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toFile(out);
    written++;
  }
  return written;
}

// Supprime les miniatures dont l'original a disparu.
async function pruneOrphanThumbs() {
  let pruned = 0;
  async function prune(dir) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await prune(full);
        continue;
      }
      const m = entry.name.match(/^(.+)\.w\d+\.webp$/);
      const sourceRel = m ? path.join(path.dirname(path.relative(THUMBS_DIR, full)), m[1]) : null;
      let orphan = !m;
      if (sourceRel) {
        try {
          await fs.access(path.join(ROOT, sourceRel));
        } catch {
          orphan = true;
        }
      }
      if (orphan) {
        await fs.unlink(full);
        pruned++;
      }
    }
    const remaining = await fs.readdir(dir);
    if (remaining.length === 0 && dir !== THUMBS_DIR) await fs.rmdir(dir);
  }
  await prune(THUMBS_DIR);
  return pruned;
}

async function main() {
  const files = [];
  for await (const f of walk(ROOT)) files.push(f);

  console.log(`Found ${files.length} image files in ${ROOT}`);
  let totalBefore = 0;
  let totalAfter = 0;
  let processed = 0;
  let skipped = 0;
  let errors = 0;
  let thumbs = 0;

  for (const file of files) {
    try {
      const r = await processFile(file);
      totalBefore += r.before;
      totalAfter += r.after;
      const rel = path.relative(process.cwd(), file);
      if (r.skipped) {
        skipped++;
        process.stdout.write(`. ${rel} (${fmt(r.before)})${r.reason ? ` [${r.reason}]` : ""}\n`);
      } else {
        processed++;
        const pct = ((1 - r.after / r.before) * 100).toFixed(0);
        process.stdout.write(`✓ ${rel}  ${fmt(r.before)} → ${fmt(r.after)} (-${pct}%)\n`);
      }
      thumbs += await generateThumbs(file);
    } catch (err) {
      errors++;
      console.error(`✗ ${file}: ${err.message}`);
    }
  }

  const pruned = await pruneOrphanThumbs();

  console.log("");
  console.log(`Processed: ${processed}`);
  console.log(`Skipped:   ${skipped}`);
  console.log(`Errors:    ${errors}`);
  console.log(`Thumbs:    ${thumbs} générées, ${pruned} orphelines supprimées`);
  console.log(`Total before: ${fmt(totalBefore)}`);
  console.log(`Total after:  ${fmt(totalAfter)}`);
  console.log(`Saved:        ${fmt(totalBefore - totalAfter)} (-${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
