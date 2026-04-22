"use client";

import { useState, lazy, Suspense } from "react";
import Image from "next/image";
import type { Oeuvre } from "@/lib/types";
import type { OeuvreSection } from "@/lib/content";

const LazyLightbox = lazy(() => import("./OeuvresLightbox"));

export default function OeuvresGallery({ sections }: { sections: OeuvreSection[] }) {
  const [index, setIndex] = useState(-1);

  const toutesOeuvres: Oeuvre[] = sections.flatMap((s) => s.oeuvres);

  const slides = toutesOeuvres.map((o) => ({
    src: o.image,
    alt: o.titre,
    title: o.titre,
    description: [o.technique, o.dimensions, o.annee].filter(Boolean).join(" — "),
  }));

  const offsets = sections.reduce<number[]>((acc, section, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + sections[i - 1].oeuvres.length);
    return acc;
  }, []);

  return (
    <>
      {sections.map((section, si) => {
        const sectionOffset = offsets[si];
        return (
          <div key={si} className={si > 0 ? "mt-12" : ""}>
            {section.label && (
              <p className="text-xs uppercase tracking-[0.15em] text-sienna mb-5">
                {section.label}
              </p>
            )}
            <div className="columns-2 gap-5 space-y-5">
              {section.oeuvres.map((oeuvre, i) => (
                <div key={i} className="break-inside-avoid">
                  <button
                    type="button"
                    className="block w-full rounded-sm overflow-hidden bg-cream cursor-zoom-in text-left"
                    onClick={() => setIndex(sectionOffset + i)}
                    aria-label={`Agrandir ${oeuvre.titre}`}
                  >
                    <Image
                      src={oeuvre.image}
                      alt={oeuvre.titre}
                      width={800}
                      height={1000}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px"
                      className="w-full h-auto hover:opacity-90 transition-opacity"
                    />
                  </button>
                  <p className="text-sm text-charcoal mt-2">{oeuvre.titre}</p>
                  <p className="text-xs text-stone">
                    {[oeuvre.technique, oeuvre.dimensions, oeuvre.annee].filter(Boolean).join(" — ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {index >= 0 && (
        <Suspense fallback={null}>
          <LazyLightbox
            open
            index={index}
            close={() => setIndex(-1)}
            slides={slides}
          />
        </Suspense>
      )}
    </>
  );
}
