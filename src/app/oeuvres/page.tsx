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
        {toutesOeuvres.length} oeuvres &middot; {artistes.filter((a) => a.oeuvres.length > 0).length} artistes
      </p>

      <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-1.5">
        {toutesOeuvres.map((oeuvre, i) => (
          <Link
            key={i}
            href={`/artistes/${oeuvre.artisteSlug}`}
            className="group relative block mb-1.5 break-inside-avoid rounded-sm overflow-hidden bg-cream"
          >
            <img
              src={oeuvre.image}
              alt={`${oeuvre.titre} — ${oeuvre.artisteNom}`}
              className="w-full transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
              <div>
                <p className="text-white text-sm font-serif leading-tight">
                  {oeuvre.artisteNom}
                </p>
                {oeuvre.titre && oeuvre.titre !== `Oeuvre ${i + 1}` && (
                  <p className="text-white/70 text-xs mt-0.5">{oeuvre.titre}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
