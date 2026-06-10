// URLs des miniatures WebP générées par scripts/compress-images.mjs.
// /images/<chemin>/<fichier> → /images/_thumbs/<chemin>/<fichier>.w<W>.webp
// Les largeurs doivent rester synchronisées avec THUMB_VARIANTS du script.

export const THUMB_WIDTHS = [480, 960] as const;

// Beaucoup de fichiers uploadés via l'admin contiennent espaces et accents :
// un srcset les interprète comme séparateurs, il faut donc encoder les URLs.
export function isThumbable(src: string): boolean {
  return src.startsWith("/images/") && /\.(jpe?g|png)$/i.test(src);
}

export function thumbUrl(src: string, width: number): string {
  return encodeURI(`/images/_thumbs${src.slice("/images".length)}.w${width}.webp`);
}

// Le fichier original sert de plus grand candidat (compressé ≤1600px par le
// script), pour rester net sur les grands affichages retina.
export function thumbSrcSet(src: string): string {
  const candidates = THUMB_WIDTHS.map((w) => `${thumbUrl(src, w)} ${w}w`);
  candidates.push(`${encodeURI(src)} 1600w`);
  return candidates.join(", ");
}
