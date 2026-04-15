"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import type { Oeuvre } from "@/lib/types";
import type { OeuvreSection } from "@/lib/content";

export default function OeuvresGallery({ sections }: { sections: OeuvreSection[] }) {
  const [index, setIndex] = useState(-1);

  // Flatten all oeuvres across sections for lightbox navigation
  const toutesOeuvres: Oeuvre[] = sections.flatMap((s) => s.oeuvres);

  const slides = toutesOeuvres.map((o) => ({
    src: o.image,
    alt: o.titre,
    title: o.titre,
    description: [o.technique, o.dimensions, o.annee].filter(Boolean).join(" — "),
  }));

  // Track cumulative index offset per section
  let offset = 0;

  return (
    <>
      {sections.map((section, si) => {
        const sectionOffset = offset;
        offset += section.oeuvres.length;
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
                  <div
                    className="rounded-sm overflow-hidden bg-cream cursor-pointer"
                    onClick={() => setIndex(sectionOffset + i)}
                  >
                    <img
                      src={oeuvre.image}
                      alt={oeuvre.titre}
                      className="w-full hover:opacity-90 transition-opacity"
                    />
                  </div>
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

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
        plugins={[Zoom, Captions]}
        captions={{ descriptionTextAlign: "center" }}
        styles={{
          container: { backgroundColor: "rgba(28, 25, 23, 0.95)" },
        }}
      />
    </>
  );
}
