import Link from "next/link";
import { getPageCollectif } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Le Collectif",
  description: "Fondé en 2015, Les Peintres de Royan est un collectif de 23 artistes contemporains.",
};

const photos = [
  { src: "/images/expositions/vernissage-salle.jpg", alt: "Vernissage — les artistes et le public dans la salle d'exposition" },
  { src: "/images/association/artiste-atelier.jpg", alt: "Une artiste du collectif en train de peindre" },
  { src: "/images/expositions/vernissage-temple.jpg", alt: "Inauguration d'une exposition avec les élus" },
  { src: "/images/association/membres-jardins.jpg", alt: "Les membres du collectif aux Jardins de la Mer" },
  { src: "/images/association/membres-jardins-2.jpg", alt: "Convivialité entre les artistes aux Jardins de la Mer" },
];

export default function LeCollectif() {
  const page = getPageCollectif();

  return (
    <>
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-16 leading-tight">
          {page.titre}
        </h1>

        {/* Hero photo — vernissage */}
        <div className="aspect-[16/9] rounded-sm overflow-hidden bg-cream mb-20 -mx-6 sm:mx-0">
          <img
            src="/images/expositions/vernissage-salle.jpg"
            alt="Vernissage d'une exposition des Peintres de Royan"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sienna mb-4">Histoire</p>
            {page.histoire.split("\n").filter(Boolean).map((p, i) => (
              <p key={i} className="text-charcoal-light leading-relaxed mb-4">{p}</p>
            ))}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sienna mb-4">Philosophie</p>
            {page.philosophie.split("\n").filter(Boolean).map((p, i) => (
              <p key={i} className="text-charcoal-light leading-relaxed mb-4">{p}</p>
            ))}
          </div>
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-2 gap-3 mb-20 -mx-6 sm:mx-0">
          <div className="row-span-2 rounded-sm overflow-hidden bg-cream">
            <img
              src="/images/association/artiste-atelier.jpg"
              alt="Une artiste du collectif en train de peindre"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-sm overflow-hidden bg-cream">
            <img
              src="/images/association/membres-jardins.jpg"
              alt="Les membres aux Jardins de la Mer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-sm overflow-hidden bg-cream">
            <img
              src="/images/association/membres-jardins-2.jpg"
              alt="Convivialité entre artistes"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Photo vernissage temple */}
        <div className="aspect-[16/9] rounded-sm overflow-hidden bg-cream mb-20 -mx-6 sm:mx-0">
          <img
            src="/images/expositions/vernissage-temple.jpg"
            alt="Inauguration d'une exposition"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Chiffres */}
      <section className="border-y border-stone/15 py-16">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: "2015", label: "Fondation" },
            { value: "23", label: "Artistes" },
            { value: "6", label: "Expositions / an" },
            { value: "20 €", label: "Cotisation" },
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
