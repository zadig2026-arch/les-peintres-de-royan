import Link from "next/link";
import { getAllArtistes } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oeuvres",
  description:
    "Galerie des oeuvres du collectif Les Peintres de Royan. Peinture contemporaine, abstraction, figuratif.",
};

export default function OeuvresPage() {
  const artistes = getAllArtistes();

  // Collect all oeuvres with their artist info
  const toutesOeuvres = artistes.flatMap((artiste) =>
    artiste.oeuvres.map((oeuvre) => ({
      ...oeuvre,
      artisteNom: artiste.nom,
      artisteSlug: artiste.slug,
    }))
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-3">
        Oeuvres
      </h1>
      <p className="text-stone text-lg mb-16">
        {toutesOeuvres.length} oeuvres de {artistes.filter((a) => a.oeuvres.length > 0).length} artistes
      </p>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
        {toutesOeuvres.map((oeuvre, i) => (
          <div key={i} className="break-inside-avoid group">
            <Link href={`/artistes/${oeuvre.artisteSlug}`}>
              <div className="rounded-sm overflow-hidden bg-cream">
                <img
                  src={oeuvre.image}
                  alt={`${oeuvre.titre} — ${oeuvre.artisteNom}`}
                  className="w-full transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="mt-2 mb-1">
                <p className="text-sm text-charcoal group-hover:text-sienna transition-colors">
                  {oeuvre.artisteNom}
                </p>
                {oeuvre.technique && (
                  <p className="text-xs text-stone">{oeuvre.technique}</p>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
