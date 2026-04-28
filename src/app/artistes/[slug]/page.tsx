import { getArtisteBySlug, getArtisteSlugs, grouperOeuvresParSerie } from "@/lib/content";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import OeuvresGallery from "@/components/ui/OeuvresGallery";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getArtisteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artiste = getArtisteBySlug(slug);
  if (!artiste) return {};
  const techniques = artiste.techniques.join(", ");
  const description = `${artiste.nom}, artiste membre des Peintres de Royan. ${techniques}. Expositions en Charente-Maritime.`.slice(0, 160);
  return {
    title: artiste.nom,
    description,
    alternates: { canonical: `/artistes/${artiste.slug}` },
    openGraph: {
      title: `${artiste.nom} — Les Peintres de Royan`,
      description,
      url: `/artistes/${artiste.slug}`,
      ...(artiste.portrait && {
        images: [{ url: artiste.portrait, alt: artiste.nom }],
      }),
    },
  };
}

export default async function ArtistePage({ params }: Props) {
  const { slug } = await params;
  const artiste = getArtisteBySlug(slug);
  if (!artiste) notFound();

  const site = "https://lespeintresderoyan.fr";
  const artisteUrl = `${site}/artistes/${artiste.slug}`;
  const sameAs: string[] = [];
  if (artiste.site_web) sameAs.push(artiste.site_web);
  if (artiste.instagram) sameAs.push(artiste.instagram);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${artisteUrl}#person`,
    name: artiste.nom,
    description: artiste.bio,
    url: artisteUrl,
    ...(artiste.portrait && { image: `${site}${artiste.portrait}` }),
    ...(sameAs.length > 0 && { sameAs }),
    jobTitle: "Artiste",
    knowsAbout: artiste.techniques,
    memberOf: {
      "@type": "Organization",
      "@id": `${site}/#organization`,
      name: "Les Peintres de Royan",
      url: site,
    },
  };

  const oeuvresJsonLd = artiste.oeuvres.map((o, i) => ({
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: o.titre,
    image: `${site}${o.image}`,
    ...(o.annee && { dateCreated: o.annee }),
    ...(o.technique && { artMedium: o.technique }),
    ...(o.dimensions && { artworkSurface: o.dimensions }),
    creator: { "@id": `${artisteUrl}#person` },
    isPartOf: { "@id": `${artisteUrl}#person` },
    position: i + 1,
  }));

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      {oeuvresJsonLd.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(oeuvresJsonLd),
          }}
        />
      )}
      <Breadcrumbs
        items={[
          { label: "Artistes", href: "/artistes" },
          { label: artiste.nom, href: `/artistes/${artiste.slug}` },
        ]}
      />

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div>
          <div className="aspect-[3/4] relative rounded-sm overflow-hidden bg-cream mb-6">
            {artiste.portrait ? (
              <Image
                src={artiste.portrait}
                alt={`Portrait de ${artiste.nom}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
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
              <OeuvresGallery
                sections={grouperOeuvresParSerie(artiste.oeuvres, artiste.series_ordre)}
                layout={artiste.mise_en_page_galerie ?? "masonry-2"}
              />
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
