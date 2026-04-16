"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";

interface OeuvreAvecMeta {
  titre: string;
  image: string;
  annee?: string;
  technique?: string;
  dimensions?: string;
  serie?: string;
  artisteNom: string;
  artisteSlug: string;
}

interface Props {
  items: OeuvreAvecMeta[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function OeuvresCarousel({ items }: Props) {
  const shuffled = useMemo(() => shuffle(items), [items]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "y",
    align: "center",
    containScroll: "trimSnaps",
    loop: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  // Keyboard navigation
  useEffect(() => {
    if (!emblaApi) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        emblaApi.scrollNext();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        emblaApi.scrollPrev();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [emblaApi]);

  if (shuffled.length === 0) return null;

  const current = shuffled[selectedIndex];

  return (
    <div
      role="region"
      aria-roledescription="carrousel"
      aria-label="Galerie des œuvres"
      className="relative"
    >
      {/* Viewport vertical */}
      <div
        className="embla__viewport--vertical h-[75vh] sm:h-[80vh]"
        ref={emblaRef}
      >
        <div className="embla__container--vertical h-full">
          {shuffled.map((oeuvre, i) => (
            <div
              key={`${oeuvre.artisteSlug}-${oeuvre.titre}-${i}`}
              className="flex-[0_0_100%] min-h-0 flex items-center justify-center px-4"
            >
              <Link
                href={`/artistes/${oeuvre.artisteSlug}`}
                className="block"
              >
                <img
                  src={oeuvre.image}
                  alt={`${oeuvre.titre} — ${oeuvre.artisteNom}`}
                  loading="lazy"
                  className="max-h-[65vh] sm:max-h-[70vh] max-w-full object-contain rounded-sm mx-auto"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Metadata + navigation */}
      <div className="flex items-center justify-between mt-6 px-2">
        {/* Info artiste */}
        <div className="min-w-0 flex-1">
          <Link
            href={`/artistes/${current.artisteSlug}`}
            className="hover:text-sienna transition-colors"
          >
            <p className="font-serif text-lg text-charcoal">
              {current.artisteNom}
            </p>
          </Link>
          {current.titre && !current.titre.match(/^Oeuvre \d+$/i) && (
            <p className="text-stone text-sm mt-0.5 italic">{current.titre}</p>
          )}
          {(current.technique || current.dimensions || current.annee) && (
            <p className="text-stone/60 text-xs mt-1">
              {[current.technique, current.dimensions, current.annee]
                .filter(Boolean)
                .join(" — ")}
            </p>
          )}
        </div>

        {/* Compteur + flèches */}
        <div className="flex items-center gap-4 flex-shrink-0 ml-6">
          <button
            onClick={scrollPrev}
            aria-label="Œuvre précédente"
            className="text-stone hover:text-sienna transition-colors p-1.5"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 11L9 6L14 11" />
            </svg>
          </button>

          <span
            className="text-sm text-stone font-sans tabular-nums"
            aria-live="polite"
          >
            {selectedIndex + 1} / {shuffled.length}
          </span>

          <div className="hidden sm:flex items-center gap-2 text-sm text-charcoal-light" aria-hidden="true">
            <kbd className="inline-flex items-center justify-center w-8 h-8 border border-stone/50 bg-cream rounded-md shadow-[0_2px_0_0_rgba(0,0,0,0.08)] font-sans text-sm">↑</kbd>
            <kbd className="inline-flex items-center justify-center w-8 h-8 border border-stone/50 bg-cream rounded-md shadow-[0_2px_0_0_rgba(0,0,0,0.08)] font-sans text-sm">↓</kbd>
          </div>

          <button
            onClick={scrollNext}
            aria-label="Œuvre suivante"
            className="text-stone hover:text-sienna transition-colors p-1.5"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 7L9 12L14 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
