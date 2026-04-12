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

          <nav className="flex flex-col gap-2 text-sm">
            <p className="text-xs uppercase tracking-[0.15em] text-stone mb-2">Navigation</p>
            <Link href="/le-collectif" className="text-charcoal-light hover:text-sienna transition-colors">Le Collectif</Link>
            <Link href="/artistes" className="text-charcoal-light hover:text-sienna transition-colors">Artistes</Link>
            <Link href="/expositions" className="text-charcoal-light hover:text-sienna transition-colors">Expositions</Link>
            <Link href="/nous-rejoindre" className="text-charcoal-light hover:text-sienna transition-colors">Nous Rejoindre</Link>
          </nav>

          <div className="text-sm">
            <p className="text-xs uppercase tracking-[0.15em] text-stone mb-2">Contact</p>
            <a href="mailto:lespeintresderoyan@gmail.com" className="block text-charcoal-light hover:text-sienna transition-colors">
              lespeintresderoyan@gmail.com
            </a>
            <a href="tel:0651764244" className="block text-charcoal-light hover:text-sienna transition-colors mt-1">
              06 51 76 42 44
            </a>
            <div className="flex gap-4 mt-4 text-stone">
              <a href="https://www.facebook.com/peintresderoyan/" target="_blank" rel="noopener noreferrer" className="hover:text-sienna transition-colors">
                Facebook
              </a>
              <a href="https://www.instagram.com/lespeintresderoyan/" target="_blank" rel="noopener noreferrer" className="hover:text-sienna transition-colors">
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-stone/10 mt-12 pt-6 text-xs text-stone">
          &copy; {new Date().getFullYear()} Les Peintres de Royan
        </div>
      </div>
    </footer>
  );
}
