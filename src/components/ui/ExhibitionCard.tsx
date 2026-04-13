import Link from "next/link";
import type { Exposition } from "@/lib/types";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
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
      <div className="rounded-sm overflow-hidden mb-4">
        <div className="bg-[#2C2420] text-white/90 p-5 group-hover:bg-[#352E29] transition-colors">
          <p className="text-[10px] uppercase tracking-[0.2em] text-sienna mb-2">Exposition</p>
          <h4 className="font-serif text-base leading-snug mb-4">{expo.titre}</h4>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/70">
            <span>{formatDateShort(expo.date_debut)} — {formatDateShort(expo.date_fin)} {new Date(expo.date_debut).getFullYear()}</span>
            <span>{expo.lieu.split(",")[0]}</span>
            <span>{expo.horaires}</span>
            {expo.entree_libre && <span className="text-sienna">Entrée libre</span>}
          </div>
        </div>
      </div>
      <p className="text-xs uppercase tracking-[0.15em] text-sienna">
        {statutLabel[expo.statut]}
      </p>
    </Link>
  );
}
