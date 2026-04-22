import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page introuvable",
  description: "La page demandée n'existe pas ou a été déplacée.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-sienna mb-6">Erreur 404</p>
      <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-6 leading-tight">
        Cette page s&apos;est égarée
      </h1>
      <p className="text-charcoal-light text-lg leading-relaxed mb-12 max-w-xl mx-auto">
        L&apos;adresse que vous cherchez n&apos;existe pas, ou a peut-être été déplacée.
        Revenons à l&apos;essentiel : l&apos;art, les artistes, les expositions.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-block bg-charcoal text-linen px-7 py-3 text-sm tracking-wide uppercase font-medium hover:bg-sienna transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/artistes"
          className="inline-block border border-charcoal/30 text-charcoal px-7 py-3 text-sm tracking-wide uppercase font-medium hover:border-sienna hover:text-sienna transition-colors"
        >
          Parcourir les artistes
        </Link>
        <Link
          href="/oeuvres"
          className="inline-block border border-charcoal/30 text-charcoal px-7 py-3 text-sm tracking-wide uppercase font-medium hover:border-sienna hover:text-sienna transition-colors"
        >
          Voir les œuvres
        </Link>
      </div>
    </div>
  );
}
