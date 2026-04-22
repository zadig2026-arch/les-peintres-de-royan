import Link from "next/link";
import Image from "next/image";
import { getPageCollectif } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Le Collectif",
  description:
    "Fondé en 2015 par Catherine Delcan, Les Peintres de Royan réunit 23 artistes contemporains autour de la peinture, du dessin et de la gravure à Royan.",
  alternates: { canonical: "/le-collectif" },
};

export default function LeCollectif() {
  const page = getPageCollectif();

  return (
    <>
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-16 leading-tight">
          {page.titre}
        </h1>

        {/* Hero photo — vernissage */}
        <div className="aspect-[16/9] relative rounded-sm overflow-hidden bg-cream mb-20 -mx-6 sm:mx-0">
          <Image
            src="/images/expositions/vernissage-salle.jpg"
            alt="Vernissage d'une exposition des Peintres de Royan"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-sienna mb-4 font-sans font-normal">Histoire</h2>
            {page.histoire.split("\n").filter(Boolean).map((p, i) => (
              <p key={i} className="text-charcoal-light leading-relaxed mb-4">{p}</p>
            ))}
          </div>
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] text-sienna mb-4 font-sans font-normal">Philosophie</h2>
            {page.philosophie.split("\n").filter(Boolean).map((p, i) => (
              <p key={i} className="text-charcoal-light leading-relaxed mb-4">{p}</p>
            ))}
          </div>
        </div>

        {/* Photo groupe — expo Cinéma Le Lido */}
        <div className="rounded-sm overflow-hidden bg-cream mb-20 -mx-6 sm:mx-0">
          <Image
            src="/images/expositions/groupe-cinema-lido.jpg"
            alt="Les Peintres de Royan exposant au cinéma Le Lido"
            width={1600}
            height={1067}
            sizes="(max-width: 1024px) 100vw, 896px"
            className="w-full h-auto"
          />
        </div>

        {/* Nos ateliers */}
        <div className="mb-20">
          <h2 className="text-xs uppercase tracking-[0.2em] text-sienna mb-6 font-sans font-normal">Nos ateliers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 -mx-6 sm:mx-0">
            <div className="aspect-[4/3] relative rounded-sm overflow-hidden bg-cream">
              <Image
                src="/images/association/nos-ateliers-1.jpg"
                alt="Atelier des Peintres de Royan — vue d'ensemble"
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="aspect-[4/3] relative rounded-sm overflow-hidden bg-cream">
              <Image
                src="/images/association/nos-ateliers-2.jpg"
                alt="Atelier des Peintres de Royan — détail"
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chiffres */}
      <section className="border-y border-stone/15 py-16">
        <div className="max-w-3xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {[
            { value: "2015", label: "Fondation" },
            { value: "23", label: "Artistes" },
            { value: "6", label: "Expositions / an" },
          ].map((c) => (
            <div key={c.label}>
              <p className="font-serif text-3xl text-charcoal">{c.value}</p>
              <p className="text-xs text-stone mt-1 uppercase tracking-wide">{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-stone mb-8 max-w-lg mx-auto">
          Le collectif accueille de nouveaux talents. Présentez votre candidature.
        </p>
        <Link
          href="/nous-rejoindre"
          className="inline-block border border-charcoal text-charcoal hover:bg-charcoal hover:text-linen px-8 py-3 text-sm tracking-wide uppercase font-medium transition-all"
        >
          Nous rejoindre
        </Link>
      </div>
    </>
  );
}
