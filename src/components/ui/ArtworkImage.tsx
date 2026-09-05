"use client";

import { useState } from "react";
import { encodeImagePath, isThumbable, thumbSrcSet } from "@/lib/img";

// Image de galerie avec vrai srcset (miniatures WebP + original).
// next/image est inutilisable ici : images.unoptimized = true (quota Vercel
// épuisé) le réduit à un <img> sans srcset. Ce composant sert les miniatures
// générées par scripts/compress-images.mjs et retombe sur l'original si une
// miniature manque (ex. upload admin déployé avant le passage de la CI).

type Props = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  width?: number;
  height?: number;
  /** Remplit son conteneur (équivalent de next/image fill). */
  fill?: boolean;
  /** Chargement prioritaire pour les images au-dessus de la ligne de flottaison. */
  eager?: boolean;
};

export default function ArtworkImage({
  src,
  alt,
  sizes,
  className = "",
  width,
  height,
  fill = false,
  eager = false,
}: Props) {
  const [thumbsBroken, setThumbsBroken] = useState(false);
  const useThumbs = !thumbsBroken && isThumbable(src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={encodeImagePath(src)}
      srcSet={useThumbs ? thumbSrcSet(src) : undefined}
      sizes={useThumbs ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      decoding="async"
      onError={() => {
        if (useThumbs) setThumbsBroken(true);
      }}
      className={`${fill ? "absolute inset-0 h-full w-full object-cover" : ""} ${className}`}
    />
  );
}
