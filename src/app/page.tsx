import Link from "next/link";
import { getPageAccueil, getExpositionsActuelles, getAllArtistes } from "@/lib/content";
import ExhibitionCard from "@/components/ui/ExhibitionCard";

export default function Accueil() {
  const page = getPageAccueil();
  const expos = getExpositionsActuelles();
  const artistes = getAllArtistes();

  // Pick a few featured artworks for the gallery strip (HD Facebook photos)
  const oeuvres = [
    { src: "/images/artistes/lydia-leas/oeuvre-1.jpg", nom: "Lydia Leas" },
    { src: "/images/artistes/astrid-van-der-weerd/oeuvre-1.jpg", nom: "Astrid Van der Weerd" },
    { src: "/images/artistes/catherine-delcan/oeuvre-1.jpg", nom: "Catherine Delcan" },
    { src: "/images/artistes/odile-naulin/oeuvre-1.jpg", nom: "Odile Naulin" },
    { src: "/images/artistes/nicole-lesueur/oeuvre-1.jpg", nom: "Nicole Lesueur" },
    { src: "/images/artistes/martine-cavalec/oeuvre-1.jpg", nom: "Martine Cavalec" },
    { src: "/images/artistes/lise-thabaud/oeuvre-1.jpg", nom: "Lise Thabaud" },
    { src: "/images/artistes/milah-hernandez/oeuvre-1.jpg", nom: "Milah Hernandez" },
  ];

  return (
    <>
      {/* Hero — typographic + mosaic */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-charcoal leading-[1.05] mb-8">
              Les Peintres
              <br />
              <em className="text-sienna">de Royan</em>
            </h1>
            <p className="text-lg text-charcoal-light max-w-md leading-relaxed mb-8">
              {page.section_presentation}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/artistes"
                className="inline-block bg-charcoal text-linen px-7 py-3 text-sm tracking-wide uppercase font-medium hover:bg-sienna transition-colors"
              >
                Les artistes
              </Link>
              <Link
                href="/expositions"
                className="inline-block border border-charcoal/30 text-charcoal px-7 py-3 text-sm tracking-wide uppercase font-medium hover:border-sienna hover:text-sienna transition-colors"
              >
                Expositions
              </Link>
            </div>
          </div>

          {/* Mosaic of artworks */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-3">
              <div className="aspect-[3/4] rounded-sm overflow-hidden bg-cream">
                <img src="/images/artistes/astrid-van-der-weerd/oeuvre-1.jpg" alt="Astrid Van der Weerd" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square rounded-sm overflow-hidden bg-cream">
                <img src="/images/artistes/lydia-leas/oeuvre-1.jpg" alt="Lydia Leas" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="space-y-3 pt-8">
              <div className="aspect-square rounded-sm overflow-hidden bg-cream">
                <img src="/images/artistes/catherine-delcan/oeuvre-1.jpg" alt="Catherine Delcan" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[3/4] rounded-sm overflow-hidden bg-cream">
                <img src="/images/artistes/odile-naulin/oeuvre-1.jpg" alt="Odile Naulin" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next exhibition — asymmetric layout */}
      {expos.length > 0 && (
        <section className="bg-cream py-20">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-xs uppercase tracking-[0.2em] text-stone mb-8">
              Prochainement
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {expos.slice(0, 2).map((expo) => (
                <ExhibitionCard key={expo.slug} expo={expo} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Oeuvres strip — horizontal scroll */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <h2 className="font-serif text-3xl text-charcoal">Oeuvres</h2>
          <p className="text-stone mt-2">
            {artistes.length} artistes, entre figuratif et abstraction
          </p>
        </div>
        <div className="flex gap-4 px-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {oeuvres.map((o, i) => (
            <div
              key={i}
              className="shrink-0 w-[280px] sm:w-[320px] snap-start"
            >
              <div className="aspect-[3/4] rounded-sm overflow-hidden bg-stone/10">
                <img
                  src={o.src}
                  alt={o.nom}
                  className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                />
              </div>
              <p className="mt-3 text-sm text-stone">{o.nom}</p>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-8">
          <Link
            href="/artistes"
            className="text-sienna hover:text-sienna-dark text-sm tracking-wide uppercase font-medium"
          >
            Voir tous les artistes &rarr;
          </Link>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-cream py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <blockquote className="font-serif text-2xl sm:text-3xl text-charcoal leading-relaxed italic">
            &laquo;&thinsp;Nous ne cherchons pas forcément à plaire
            mais à développer un travail personnel&thinsp;&raquo;
          </blockquote>
          <p className="mt-6 text-sm text-stone tracking-wide uppercase">
            Catherine Delcan, fondatrice
          </p>
        </div>
      </section>

      {/* Artistes preview — horizontal strip of names */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-3xl text-charcoal mb-12">Les artistes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4">
            {artistes.slice(0, 12).map((a) => (
              <Link
                key={a.slug}
                href={`/artistes/${a.slug}`}
                className="group py-3 border-b border-stone/20 hover:border-sienna transition-colors"
              >
                <span className="font-serif text-lg text-charcoal group-hover:text-sienna transition-colors">
                  {a.nom}
                </span>
                {a.role && a.role !== "Membre" && (
                  <span className="block text-xs text-stone mt-0.5">{a.role}</span>
                )}
              </Link>
            ))}
          </div>
          {artistes.length > 12 && (
            <Link
              href="/artistes"
              className="inline-block mt-10 text-sienna hover:text-sienna-dark text-sm tracking-wide uppercase font-medium"
            >
              Voir les {artistes.length} artistes &rarr;
            </Link>
          )}
        </div>
      </section>

      {/* Join CTA */}
      <section className="bg-charcoal text-linen py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl mb-4">
            Vous êtes artiste ?
          </h2>
          <p className="text-stone text-lg mb-10 max-w-lg mx-auto">
            Le collectif accueille de nouveaux talents. Peinture, sculpture,
            gravure — rejoignez un groupe passionné.
          </p>
          <Link
            href="/nous-rejoindre"
            className="inline-block border border-linen/30 hover:bg-linen hover:text-charcoal px-8 py-3 text-sm tracking-wide uppercase font-medium transition-all"
          >
            Nous rejoindre
          </Link>
        </div>
      </section>
    </>
  );
}
