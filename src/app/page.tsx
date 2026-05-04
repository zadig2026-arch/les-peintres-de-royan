import Link from "next/link";
import Image from "next/image";
import { getPageAccueil, getExpositionsActuelles, getAllArtistes } from "@/lib/content";

export default function Accueil() {
  const page = getPageAccueil();
  const expos = getExpositionsActuelles();
  const artistes = getAllArtistes();

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
              <div className="aspect-[3/4] relative rounded-sm overflow-hidden bg-cream">
                <Image
                  src={page.accueil_image_1 ?? "/images/artistes/portraits/catherine-delcan.jpg"}
                  alt="Photo d'accueil 1"
                  fill
                  priority
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="aspect-square relative rounded-sm overflow-hidden bg-cream">
                <Image
                  src={page.accueil_image_2 ?? "/images/artistes/portraits/claudine-mingot.jpg"}
                  alt="Photo d'accueil 2"
                  fill
                  priority
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-3 pt-8">
              <div className="aspect-square relative rounded-sm overflow-hidden bg-cream">
                <Image
                  src={page.accueil_image_3 ?? "/images/artistes/portraits/astrid-van-der-weerd.jpg"}
                  alt="Photo d'accueil 3"
                  fill
                  priority
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="aspect-[3/4] relative rounded-sm overflow-hidden bg-cream">
                <Image
                  src={page.accueil_image_4 ?? "/images/artistes/portraits/odile-naulin.jpg"}
                  alt="Photo d'accueil 4"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expo banner */}
      {expos.length > 0 && (
        <section className="bg-[#2C2420] text-white/90">
          <div className="max-w-7xl mx-auto px-6 py-10 sm:py-14">
            <p className="text-[10px] uppercase tracking-[0.25em] text-sienna mb-6">
              {expos.length === 1 ? "Prochaine exposition" : "Prochaines expositions"}
            </p>
            <div className="space-y-6">
              {expos.slice(0, 3).map((expo) => (
                <Link
                  key={expo.slug}
                  href={`/expositions/${expo.slug}`}
                  className="group block sm:flex sm:items-baseline sm:gap-8 py-4 border-b border-white/10 last:border-0 hover:border-sienna/30 transition-colors"
                >
                  <h3 className="font-serif text-xl sm:text-2xl group-hover:text-sienna transition-colors">
                    {expo.titre}
                  </h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 sm:mt-0 text-sm text-white/60">
                    <span>
                      {new Date(expo.date_debut).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                      {" — "}
                      {new Date(expo.date_fin).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <span>{expo.lieu.split(",")[0]}</span>
                    {expo.entree_libre && <span className="text-sienna">Entrée libre</span>}
                  </div>
                </Link>
              ))}
            </div>
            {expos.length > 3 && (
              <Link
                href="/expositions"
                className="inline-block mt-8 text-sienna text-sm tracking-wide uppercase font-medium hover:text-white transition-colors"
              >
                Toutes les expositions &rarr;
              </Link>
            )}
          </div>
        </section>
      )}


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
