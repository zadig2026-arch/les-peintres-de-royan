import { getExpositionBySlug, getExpositionSlugs } from "@/lib/content";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getExpositionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const expo = getExpositionBySlug(slug);
  if (!expo) return {};
  return {
    title: expo.titre,
    description: expo.description.slice(0, 160),
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const statutConfig: Record<string, { label: string; className: string; dot: string }> = {
  "en-cours": { label: "En cours", className: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  "a-venir": { label: "À venir", className: "bg-atlantique/10 text-atlantique border border-atlantique/20", dot: "bg-atlantique" },
  passee: { label: "Passée", className: "bg-terre/5 text-terre-light border border-terre/10", dot: "bg-terre-light" },
};

export default async function ExpositionPage({ params }: Props) {
  const { slug } = await params;
  const expo = getExpositionBySlug(slug);
  if (!expo) notFound();

  const statut = statutConfig[expo.statut] || statutConfig.passee;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
      <Link
        href="/expositions"
        className="inline-flex items-center gap-2 text-sm text-terre-light hover:text-atlantique transition-colors mb-10 group"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:-translate-x-1">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Toutes les expositions
      </Link>

      <div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-6 ${statut.className}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statut.dot}`} />
          {statut.label}
        </span>

        <h1 className="font-serif text-4xl sm:text-5xl text-terre mb-2 leading-tight">
          {expo.titre}
        </h1>
        <div className="w-12 h-0.5 bg-or mb-10" />

        <div className="bg-white border border-sable rounded-2xl p-8 mb-10 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-atlantique mt-0.5 shrink-0">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <p className="text-terre-light text-xs uppercase tracking-wide mb-1">Lieu</p>
                <p className="text-terre font-medium">{expo.lieu}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-atlantique mt-0.5 shrink-0">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <div>
                <p className="text-terre-light text-xs uppercase tracking-wide mb-1">Dates</p>
                <p className="text-terre font-medium">
                  {formatDate(expo.date_debut)} — {formatDate(expo.date_fin)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-atlantique mt-0.5 shrink-0">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <div>
                <p className="text-terre-light text-xs uppercase tracking-wide mb-1">Horaires</p>
                <p className="text-terre font-medium">{expo.horaires}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-atlantique mt-0.5 shrink-0">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <div>
                <p className="text-terre-light text-xs uppercase tracking-wide mb-1">Entrée</p>
                <p className="text-terre font-medium">
                  {expo.entree_libre ? (
                    <span className="text-emerald-700">Gratuite</span>
                  ) : (
                    "Payante"
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-terre-light text-lg leading-relaxed">
          {expo.description.split("\n").filter(Boolean).map((p, i) => (
            <p key={i} className="mb-4">{p}</p>
          ))}
        </div>

        {expo.photos_galerie.length > 0 && (
          <div className="mt-12">
            <h2 className="font-serif text-2xl text-terre mb-6">
              Photos de l&apos;exposition
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {expo.photos_galerie.map((photo, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-sable overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  <img
                    src={photo}
                    alt={`${expo.titre} - photo ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
