import Link from "next/link";
import { getAllArtistes } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artistes",
  description:
    "Les 23 artistes du collectif Les Peintres de Royan. Peinture contemporaine, dessin, gravure.",
};

export default function ArtistesPage() {
  const artistes = getAllArtistes();

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-3">
        Les Artistes
      </h1>
      <p className="text-stone text-lg mb-16">
        {artistes.length} artistes contemporains
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {artistes.map((a) => (
          <Link
            key={a.slug}
            href={`/artistes/${a.slug}`}
            className="group block"
          >
            <div className="aspect-[4/3] relative overflow-hidden bg-stone/10 mb-4">
              {a.portrait ? (
                <img
                  src={a.portrait}
                  alt={`Oeuvre de ${a.nom}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-serif text-3xl text-stone/30">
                    {a.nom.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
              )}
            </div>
            <h2 className="font-serif text-xl text-charcoal group-hover:text-sienna transition-colors">
              {a.nom}
            </h2>
            {a.role && a.role !== "Membre" && (
              <p className="text-xs text-sienna mt-1">{a.role}</p>
            )}
            <p className="text-sm text-stone mt-1">
              {a.techniques.join(", ")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
