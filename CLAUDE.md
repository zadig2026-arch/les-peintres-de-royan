# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — Next.js dev server on http://localhost:3000
- `npm run build` — production build
- `npm run lint` — ESLint (uses `eslint-config-next`)
- `node scripts/compress-images.mjs` — resize/recompress everything under `public/images/` in place (max 1600px, JPEG q80 via mozjpeg, idempotent — skips files already under ~350 KB and rejects results that would grow the file). Also generates the responsive WebP thumbnails under `public/images/_thumbs/` (480px + 960px per original, pruned when the original disappears)

No test suite exists in this project.

## Stack

Next.js **16** App Router + React **19** + Tailwind **4** + TypeScript. The version warning in `AGENTS.md` is load-bearing — APIs and conventions differ from training data, consult `node_modules/next/dist/docs/` before writing code that touches Next.js internals.

## Content architecture

There is **no database**. All editable content lives as markdown + YAML frontmatter under `content/`, read at build time by `src/lib/content.ts` via `gray-matter`. Pages call helpers like `getArtisteBySlug` / `getAllExpositions` / `getPageAccueil`; they `readMarkdownFiles` (sync `fs`) from `content/<collection>/`.

Two non-obvious behaviors in `src/lib/content.ts`:

1. **Œuvres are split across two locations.** Each artist file may have an inline `oeuvres: []` array, but Sveltia creates one file per œuvre under `content/oeuvres/*.md` with an `artiste_slug` field. `mergeOeuvresIntoArtiste` concatenates both sources every time an artist is loaded. New work added via the admin always lands as a standalone file.
2. **Series are grouped automatically.** `grouperOeuvresParSerie` first buckets œuvres by explicit `serie` frontmatter, then auto-detects series among the rest by stripping a trailing number from titles (`Arbre 1`, `Arbre 2` → grouped as `Arbre`, requires ≥2 matches, ignores generic `Oeuvre N` titles). The `series_ordre` field on the artist controls section order; remaining series fall back to alphabetical, sectionless œuvres come last.

Sveltia sometimes serializes typed list fields as `[{nom: "Foo"}, ...]`; `normalizeSeriesOrdre` accepts both that shape and plain `string[]`.

Types for every collection are in `src/lib/types.ts` and mirror the Sveltia schema in `public/admin/config.yml`. **When you change a frontmatter shape, update both files together** or the admin will silently drop fields.

## Compteur de visites

Seule entorse au « no database » ci-dessus : le pied de page affiche un compteur de visites stocké dans un petit projet **Sanity dédié** (projectId `uooo02fk`, même approche que les sites GPPR et Bernard Devisme). Un unique document `visitCounter` porte un champ `total`, incrémenté côté serveur par la route `src/app/api/visites/route.ts` via `@sanity/client` (`src/lib/sanity.ts`, write token serveur uniquement, `.inc()`). Le composant client `CompteurVisites` appelle la route via le rewrite `/ln` (`next.config.ts`, pour échapper aux bloqueurs de pub) et n'incrémente qu'une fois par session (`sessionStorage`) ; il se masque entièrement si le service n'est pas configuré ou répond en erreur. Variables d'env : `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_WRITE_TOKEN` (secret), plus `VISITES_OFFSET` optionnel. Cf. `.env.example`. Le site n'a **pas** de Studio Sanity : le document compteur vit hors Studio, le projet Sanity ne sert qu'à ça.

## Admin (Sveltia CMS)

`/admin` serves a static Sveltia CMS page that authenticates against a Cloudflare Worker (`sveltia-cms-auth.zadig2026.workers.dev`) and commits directly to `main` via the GitHub backend. Media uploads go to `public/images/` and are referenced with `/images/...` paths. Most commits on `main` come from the bot user `lespeintresderoyan-bit`, not from a developer — expect frequent unrelated updates when pulling.

## Images

`next.config.ts` sets `images: { unoptimized: true }` deliberately. The Vercel Hobby image-optimization quota was exhausted (HTTP 402 on `/_next/image`), so all `<Image>` components now serve raw files directly from `public/images/`. To keep pages light without optimization:

- **Local script**: run `node scripts/compress-images.mjs` before committing image-heavy changes.
- **CI fallback**: `.github/workflows/compress-images.yml` triggers on any push that touches `public/images/`, runs the same script, and pushes a follow-up commit tagged `[skip-compress]` (the marker breaks the recursion). Requires the repo's *Workflow permissions* to be set to *Read and write*.

Do **not** re-enable `next/image` optimization without first migrating images off the repo (Blob/Cloudinary) — the quota will explode again.

**Responsive thumbnails.** Because `unoptimized: true` strips srcset generation, gallery images go through `src/components/ui/ArtworkImage.tsx`, a plain `<img>` that builds a real `srcset` from the WebP thumbnails in `public/images/_thumbs/` (`/images/<p>/<f>` → `/images/_thumbs/<p>/<f>.w480.webp` + `.w960.webp` + original as the 1600w candidate, URLs encoded because many CMS uploads contain spaces/accents). URL helpers live in `src/lib/img.ts`; keep its `THUMB_WIDTHS` in sync with `THUMB_VARIANTS` in the script. If a thumbnail 404s (admin upload deployed before the compress-images CI run pushed its follow-up commit), `ArtworkImage` falls back to the original file via `onError`. Lightboxes intentionally load the original full-size file.

## Deployment

Push to `main` → Vercel deploys. Production domain is `lespeintresderoyan.fr`. No staging environment.

## Conventions

- Site UI is entirely in French — keep copy, labels, and admin hints in French.
- Routes are French (`/artistes/[slug]`, `/oeuvres`, `/expositions`, `/le-collectif`, `/nous-rejoindre`).
- Galleries use the `LayoutGalerie` union (`masonry-2 | masonry-3 | grille-3 | grille-4`); the artist's `mise_en_page_galerie` field picks one.
- JSON-LD is emitted inline in page components (`Person`, `VisualArtwork`, etc.) — preserve it when refactoring artist/expo pages.
