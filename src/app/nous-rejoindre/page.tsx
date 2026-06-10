import { getPageRejoindre } from "@/lib/content";
import CandidatureForm from "@/components/ui/CandidatureForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nous Rejoindre",
  description:
    "Rejoignez le collectif Les Peintres de Royan : processus d'adhésion, cotisation annuelle, pièces à fournir et formulaire de candidature en ligne.",
  alternates: { canonical: "/nous-rejoindre" },
};

export default function NousRejoindre() {
  const page = getPageRejoindre();

  return (
    <>
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-16">{page.titre}</h1>

      <div className="text-charcoal-light leading-relaxed text-lg mb-12">
        {page.intro
          .split("\n")
          .filter(Boolean)
          .map((p, i) => (
            <p key={i} className="mb-4">
              {p}
            </p>
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-cream rounded-lg p-8">
          <h2 className="font-serif text-2xl text-charcoal mb-4">
            Cotisation annuelle
          </h2>
          <p className="text-4xl font-bold text-sienna">
            {page.cotisation} &euro;
          </p>
          <p className="text-sm text-charcoal-light mt-2">par an</p>
        </div>
        <div className="bg-cream rounded-lg p-8">
          <h2 className="font-serif text-2xl text-charcoal mb-4">
            Pièces à fournir
          </h2>
          <ul className="text-sm text-charcoal-light space-y-2">
            <li className="flex gap-2">
              <span className="text-ochre shrink-0">&#10003;</span>
              Fiche de candidature complétée
            </li>
            <li className="flex gap-2">
              <span className="text-ochre shrink-0">&#10003;</span>
              6 photos de vos oeuvres (JPEG, 300 dpi)
            </li>
            <li className="flex gap-2">
              <span className="text-ochre shrink-0">&#10003;</span>
              Photo d&apos;identité
            </li>
            <li className="flex gap-2">
              <span className="text-ochre shrink-0">&#10003;</span>
              Chèque de cotisation à l&apos;ordre de &laquo;&nbsp;Les Peintres de
              Royan&nbsp;&raquo;
            </li>
          </ul>
        </div>
      </div>

      <h2 className="font-serif text-2xl text-charcoal mb-4">
        Comment nous rejoindre
      </h2>
      <div className="text-charcoal-light leading-relaxed mb-12">
        {page.processus
          .split("\n")
          .filter(Boolean)
          .map((p, i) => (
            <p key={i} className="mb-4">
              {p}
            </p>
          ))}
      </div>

      {/* Formulaire de candidature */}
      <CandidatureForm />
    </div>
    </>
  );
}
