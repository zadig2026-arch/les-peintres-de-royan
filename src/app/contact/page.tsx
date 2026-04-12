import { getPageContact } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Les Peintres de Royan.",
};

export default function Contact() {
  const page = getPageContact();

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-16">Contact</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
        <div className="space-y-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sienna mb-3">Email</p>
            <a href={`mailto:${page.email}`} className="text-charcoal hover:text-sienna transition-colors">
              {page.email}
            </a>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sienna mb-3">Téléphone</p>
            <a href={`tel:${page.telephone.replace(/\s/g, "")}`} className="text-charcoal hover:text-sienna transition-colors">
              {page.telephone}
            </a>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sienna mb-3">Adresse</p>
            <p className="text-charcoal-light whitespace-pre-line leading-relaxed">{page.adresse}</p>
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sienna mb-3">Réseaux</p>
            <div className="space-y-2">
              {page.facebook && (
                <a href={page.facebook} target="_blank" rel="noopener noreferrer" className="block text-charcoal hover:text-sienna transition-colors">
                  Facebook &#x2197;
                </a>
              )}
              {page.instagram && (
                <a href={page.instagram} target="_blank" rel="noopener noreferrer" className="block text-charcoal hover:text-sienna transition-colors">
                  Instagram &#x2197;
                </a>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sienna mb-3">Atelier</p>
            <p className="text-charcoal-light leading-relaxed">
              Les Peintres de Royan se retrouvent chaque semaine à la Maison des Associations de Royan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
