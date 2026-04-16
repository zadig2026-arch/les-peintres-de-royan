import { getAllArtistes } from "@/lib/content";
import type { Metadata } from "next";
import OeuvresFiltrables from "@/components/ui/OeuvresFiltrables";

export const metadata: Metadata = {
  title: "Oeuvres",
  description:
    "Galerie des oeuvres du collectif Les Peintres de Royan. Peinture contemporaine, abstraction, figuratif.",
};

export default function OeuvresPage() {
  const artistes = getAllArtistes();

  // Collect all oeuvres with their artist info + techniques
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
      <p className="text-stone text-lg mb-10">
        {toutesOeuvres.length} œuvres &middot;{" "}
        {artistes.filter((a) => a.oeuvres.length > 0).length} artistes
      </p>

      <OeuvresFiltrables oeuvres={toutesOeuvres} />
    </div>
  );
}
