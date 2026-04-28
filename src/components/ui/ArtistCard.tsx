import Link from "next/link";
import type { Artiste } from "@/lib/types";

export default function ArtistCard({ artiste }: { artiste: Artiste }) {
  return (
    <Link
      href={`/artistes/${artiste.slug}`}
      className="group block py-4 border-b border-stone/15 hover:border-sienna transition-colors"
    >
      <h3 className="font-serif text-xl text-charcoal group-hover:text-sienna transition-colors">
        {artiste.nom}
      </h3>
      <p className="text-sm text-stone mt-1">
        {artiste.techniques.join(", ")}
      </p>
    </Link>
  );
}
