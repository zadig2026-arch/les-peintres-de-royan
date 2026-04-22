import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-stone/15 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2">
            <p className="font-serif text-xl text-charcoal mb-3">
              Les Peintres de Royan
            </p>
            <p className="text-sm text-stone leading-relaxed max-w-sm">
              Collectif de 23 artistes contemporains fondé en 2015.
              Royan, Charente-Maritime.
            </p>
          </div>

          <nav className="flex flex-col gap-1 text-sm" aria-label="Plan du site">
            <p className="text-xs uppercase tracking-[0.15em] text-stone mb-2">Navigation</p>
            <Link href="/le-collectif" className="text-charcoal-light hover:text-sienna transition-colors py-2">Le Collectif</Link>
            <Link href="/artistes" className="text-charcoal-light hover:text-sienna transition-colors py-2">Artistes</Link>
            <Link href="/oeuvres" className="text-charcoal-light hover:text-sienna transition-colors py-2">Oeuvres</Link>
            <Link href="/expositions" className="text-charcoal-light hover:text-sienna transition-colors py-2">Expositions</Link>
            <Link href="/nous-rejoindre" className="text-charcoal-light hover:text-sienna transition-colors py-2">Nous Rejoindre</Link>
          </nav>

          <div className="text-sm">
            <p className="text-xs uppercase tracking-[0.15em] text-stone mb-2">Contact</p>
            <a href="mailto:lespeintresderoyan@gmail.com" className="block text-charcoal-light hover:text-sienna transition-colors py-2">
              lespeintresderoyan@gmail.com
            </a>
            <a href="tel:0651764244" className="block text-charcoal-light hover:text-sienna transition-colors py-2">
              06 51 76 42 44
            </a>
            <div className="flex gap-5 mt-3 text-stone">
              <a
                href="https://www.facebook.com/peintresderoyan/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Les Peintres de Royan sur Facebook (nouvel onglet)"
                className="hover:text-sienna transition-colors py-2"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/lespeintresderoyan/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Les Peintres de Royan sur Instagram (nouvel onglet)"
                className="hover:text-sienna transition-colors py-2"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-stone/10 mt-12 pt-6 text-xs text-stone flex flex-wrap gap-x-4 gap-y-2">
          <span>&copy; {new Date().getFullYear()} Les Peintres de Royan</span>
          <Link href="/mentions-legales" className="hover:text-sienna transition-colors">
            Mentions légales
          </Link>
          <Link href="/politique-confidentialite" className="hover:text-sienna transition-colors">
            Confidentialité
          </Link>
          <span>
            Site par{" "}
            <a
              href="mailto:zadig2026@gmail.com"
              className="hover:text-sienna transition-colors underline-offset-2 hover:underline"
            >
              Zadig
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
