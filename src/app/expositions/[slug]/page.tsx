import { getExpositionBySlug, getExpositionSlugs } from "@/lib/content";
import ArtworkImage from "@/components/ui/ArtworkImage";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getExpositionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const expo = getExpositionBySlug(slug);
  if (!expo) return {};
  const description = `${expo.titre} — ${expo.lieu}. Exposition du collectif Les Peintres de Royan. ${expo.entree_libre ? "Entrée libre." : ""}`.slice(0, 160);
  return {
    title: expo.titre,
    description,
    alternates: { canonical: `/expositions/${expo.slug}` },
    openGraph: {
      title: `${expo.titre} — Les Peintres de Royan`,
      description,
      url: `/expositions/${expo.slug}`,
      ...(expo.image_principale && {
        images: [{ url: expo.image_principale, alt: expo.titre }],
      }),
    },
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Couleurs prises dans la palette de globals.css (teal/charcoal/ochre) — les
// anciens tokens terre/atlantique/or/sable n'existent pas dans ce projet.
const statutConfig: Record<string, { label: string; className: string; dot: string }> = {
  "en-cours": { label: "En cours", className: "bg-teal/10 text-teal-dark border border-teal/25", dot: "bg-teal" },
  "a-venir": { label: "À venir", className: "bg-sienna/10 text-sienna-dark border border-sienna/25", dot: "bg-sienna" },
  passee: { label: "Passée", className: "bg-stone/10 text-charcoal-light border border-stone/25", dot: "bg-stone" },
};

export default async function ExpositionPage({ params }: Props) {
  const { slug } = await params;
  const expo = getExpositionBySlug(slug);
  if (!expo) notFound();

  const statut = statutConfig[expo.statut] || statutConfig.passee;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: expo.titre,
    description: expo.description,
    startDate: expo.date_debut,
    endDate: expo.date_fin,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    ...(expo.image_principale && { image: `https://lespeintresderoyan.fr${expo.image_principale}` }),
    location: {
      "@type": "Place",
      name: expo.lieu,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Royan",
        addressRegion: "Charente-Maritime",
        addressCountry: "FR",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Les Peintres de Royan",
      url: "https://lespeintresderoyan.fr",
    },
    isAccessibleForFree: expo.entree_libre,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "Expositions", href: "/expositions" },
          { label: expo.titre, href: `/expositions/${expo.slug}` },
        ]}
      />

      <div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-6 ${statut.className}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statut.dot}`} />
          {statut.label}
        </span>

        <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-2 leading-tight">
          {expo.titre}
        </h1>
        <div className="w-12 h-0.5 bg-ochre mb-10" />

        <div className="bg-white border border-stone/20 rounded-2xl p-6 sm:p-8 mb-10 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[15px]">
            <div className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal mt-0.5 shrink-0">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <p className="text-stone text-xs uppercase tracking-wide mb-1">Lieu</p>
                <p className="text-charcoal font-medium">{expo.lieu}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal mt-0.5 shrink-0">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <div>
                <p className="text-stone text-xs uppercase tracking-wide mb-1">Dates</p>
                <p className="text-charcoal font-medium">
                  {formatDate(expo.date_debut)} — {formatDate(expo.date_fin)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal mt-0.5 shrink-0">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <div>
                <p className="text-stone text-xs uppercase tracking-wide mb-1">Horaires</p>
                <p className="text-charcoal font-medium">{expo.horaires}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal mt-0.5 shrink-0">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <div>
                <p className="text-stone text-xs uppercase tracking-wide mb-1">Entrée</p>
                <p className="text-charcoal font-medium">
                  {expo.entree_libre ? (
                    <span className="text-teal-dark">Gratuite</span>
                  ) : (
                    "Payante"
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-charcoal-light text-lg leading-relaxed">
          {expo.description.split("\n").filter(Boolean).map((p, i) => (
            <p key={i} className="mb-4">{p}</p>
          ))}
        </div>

        {expo.photos_galerie.length > 0 && (
          <div className="mt-12">
            <h2 className="font-serif text-2xl text-charcoal mb-6">
              Photos de l&apos;exposition
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {expo.photos_galerie.map((photo, i) => (
                <div
                  key={i}
                  className="aspect-square relative rounded-xl bg-cream overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  <ArtworkImage
                    src={photo}
                    alt={`${expo.titre} — photo ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
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
