import { getArtisteBySlug, getArtisteSlugs } from "@/lib/content";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getArtisteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artiste = getArtisteBySlug(slug);
  if (!artiste) return {};
  return {
    title: artiste.nom,
    description: artiste.bio.slice(0, 160),
  };
}

export default async function ArtistePage({ params }: Props) {
  const { slug } = await params;
  const artiste = getArtisteBySlug(slug);
  if (!artiste) notFound();

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <Link
        href="/artistes"
        className="text-sm text-stone hover:text-sienna transition-colors tracking-wide uppercase"
      >
        &larr; Artistes
      </Link>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div>
          <div className="aspect-[3/4] rounded-sm overflow-hidden bg-cream mb-6">
            {artiste.portrait ? (
              <img src={artiste.portrait} alt={artiste.nom} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-serif text-6xl text-stone/20">
                  {artiste.nom.split(" ").map(w => w[0]).join("")}
                </span>
              </div>
            )}
          </div>

          {artiste.role && artiste.role !== "Membre" && (
            <p className="text-xs uppercase tracking-[0.15em] text-sienna mb-4">{artiste.role}</p>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {artiste.techniques.map((t) => (
              <span key={t} className="text-xs text-stone border border-stone/20 px-3 py-1 rounded-full">
                {t}
              </span>
            ))}
          </div>

          {artiste.site_web && (
            <a href={artiste.site_web} target="_blank" rel="noopener noreferrer" className="block text-sm text-sienna hover:text-sienna-dark">
              Site web &#x2197;
            </a>
          )}
        </div>

        <div className="lg:col-span-2">
          <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-8 leading-tight">
            {artiste.nom}
          </h1>
          <p className="text-charcoal-light text-lg leading-relaxed mb-16">
            {artiste.bio}
          </p>

          {artiste.oeuvres.length > 0 ? (
            <>
              <h2 className="text-xs uppercase tracking-[0.2em] text-stone mb-8">Oeuvres</h2>
              {(() => {
                const seriesMap = new Map<string, typeof artiste.oeuvres>();
                const sansSerie: typeof artiste.oeuvres = [];
                artiste.oeuvres.forEach((o) => {
                  if (o.serie) {
                    if (!seriesMap.has(o.serie)) seriesMap.set(o.serie, []);
                    seriesMap.get(o.serie)!.push(o);
                  } else {
                    sansSerie.push(o);
                  }
                });
                seriesMap.forEach((oeuvres) =>
                  oeuvres.sort((a, b) => (a.ordre_serie ?? 99) - (b.ordre_serie ?? 99))
                );
                const sections: { label: string | null; oeuvres: typeof artiste.oeuvres }[] = [];
                seriesMap.forEach((oeuvres, label) => sections.push({ label, oeuvres }));
                if (sansSerie.length > 0) sections.push({ label: null, oeuvres: sansSerie });
                return sections.map((section, si) => (
                  <div key={si} className={si > 0 ? "mt-12" : ""}>
                    {section.label && (
                      <p className="text-xs uppercase tracking-[0.15em] text-sienna mb-5">
                        {section.label}
                      </p>
                    )}
                    <div className="columns-2 gap-5 space-y-5">
                      {section.oeuvres.map((oeuvre, i) => (
                        <div key={i} className="break-inside-avoid">
                          <div className="rounded-sm overflow-hidden bg-cream">
                            <img src={oeuvre.image} alt={oeuvre.titre} className="w-full hover:opacity-90 transition-opacity" />
                          </div>
                          <p className="text-sm text-charcoal mt-2">{oeuvre.titre}</p>
                          <p className="text-xs text-stone">
                            {[oeuvre.technique, oeuvre.dimensions, oeuvre.annee].filter(Boolean).join(" — ")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </>
          ) : (
            <div className="border border-stone/15 rounded-sm p-12 text-center">
              <p className="text-stone italic">
                Les oeuvres seront bientôt disponibles.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
