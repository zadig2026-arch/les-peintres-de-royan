import Link from "next/link";
import NewsletterForm from "@/components/ui/NewsletterForm";

export default function Footer() {
  return (
    <footer className="border-t border-stone/15 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2">
            <p className="font-serif text-xl text-charcoal mb-3">
              Les Peintres de Royan
            </p>
            <p className="text-[15px] text-stone leading-relaxed max-w-sm mb-8">
              Collectif de 23 artistes contemporains fondé en 2015.
              Royan, Charente-Maritime.
            </p>
            <NewsletterForm variant="compact" />
          </div>

          <nav className="flex flex-col gap-1 text-base" aria-label="Plan du site">
            <p className="text-xs uppercase tracking-[0.15em] text-stone mb-2">Navigation</p>
            <Link href="/le-collectif" className="flex items-center min-h-11 text-charcoal-light hover:text-sienna transition-colors">Le Collectif</Link>
            <Link href="/artistes" className="flex items-center min-h-11 text-charcoal-light hover:text-sienna transition-colors">Artistes</Link>
            <Link href="/oeuvres" className="flex items-center min-h-11 text-charcoal-light hover:text-sienna transition-colors">Oeuvres</Link>
            <Link href="/expositions" className="flex items-center min-h-11 text-charcoal-light hover:text-sienna transition-colors">Expositions</Link>
            <Link href="/nous-rejoindre" className="flex items-center min-h-11 text-charcoal-light hover:text-sienna transition-colors">Nous Rejoindre</Link>
          </nav>

          <div className="text-base">
            <p className="text-xs uppercase tracking-[0.15em] text-stone mb-2">Contact</p>
            <a href="mailto:lespeintresderoyan@gmail.com" className="flex items-center min-h-11 text-charcoal-light hover:text-sienna transition-colors break-all">
              lespeintresderoyan@gmail.com
            </a>
            <a href="tel:0651764244" className="flex items-center min-h-11 text-charcoal-light hover:text-sienna transition-colors">
              06 51 76 42 44
            </a>
            <div className="flex gap-5 mt-2 text-stone">
              <a
                href="https://www.facebook.com/peintresderoyan/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Les Peintres de Royan sur Facebook (nouvel onglet)"
                className="inline-flex items-center min-h-11 hover:text-sienna transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/lespeintresderoyan/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Les Peintres de Royan sur Instagram (nouvel onglet)"
                className="inline-flex items-center min-h-11 hover:text-sienna transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-stone/10 mt-12 pt-4 text-[13px] text-stone flex flex-wrap items-center gap-x-4">
          <span className="py-3">&copy; {new Date().getFullYear()} Les Peintres de Royan</span>
          <Link href="/mentions-legales" className="inline-flex items-center min-h-11 hover:text-sienna transition-colors">
            Mentions légales
          </Link>
          <Link href="/politique-confidentialite" className="inline-flex items-center min-h-11 hover:text-sienna transition-colors">
            Confidentialité
          </Link>
          <span className="py-3">
            Site par{" "}
            <a
              href="mailto:zadig2026@gmail.com"
              className="inline-block py-3 -my-3 hover:text-sienna transition-colors underline-offset-2 hover:underline"
            >
              Zadig
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
