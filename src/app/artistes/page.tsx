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
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-3">
        Les Artistes
      </h1>
      <p className="text-stone text-lg mb-16">
        {artistes.length} artistes contemporains
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16">
        {artistes.map((a) => (
          <Link
            key={a.slug}
            href={`/artistes/${a.slug}`}
            className="group py-5 border-b border-stone/15 hover:border-sienna transition-colors"
          >
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
