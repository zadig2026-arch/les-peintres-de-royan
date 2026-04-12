import Link from "next/link";
import type { Exposition } from "@/lib/types";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const statutLabel: Record<string, string> = {
  "en-cours": "En cours",
  "a-venir": "À venir",
  passee: "Passée",
};

export default function ExhibitionCard({ expo }: { expo: Exposition }) {
  return (
    <Link
      href={`/expositions/${expo.slug}`}
      className="group block"
    >
      <div className="aspect-[4/3] rounded-sm overflow-hidden bg-stone/10 mb-5">
        {expo.image_principale ? (
          <img
            src={expo.image_principale}
            alt={expo.titre}
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream to-linen">
            <span className="font-serif text-2xl text-stone/30 italic">
              {formatDate(expo.date_debut).split(" ").slice(1, 3).join(" ")}
            </span>
          </div>
        )}
      </div>
      <p className="text-xs uppercase tracking-[0.15em] text-sienna mb-2">
        {statutLabel[expo.statut]} · {expo.entree_libre && "Entrée libre"}
      </p>
      <h3 className="font-serif text-xl text-charcoal group-hover:text-sienna transition-colors leading-snug">
        {expo.titre}
      </h3>
      <p className="text-sm text-stone mt-2">{expo.lieu}</p>
      <p className="text-sm text-charcoal-light mt-1">
        {formatDate(expo.date_debut)} — {formatDate(expo.date_fin)}
      </p>
    </Link>
  );
}
