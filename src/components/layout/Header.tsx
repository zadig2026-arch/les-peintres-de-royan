"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

const links = [
  { href: "/le-collectif", label: "Le Collectif" },
  { href: "/artistes", label: "Artistes" },
  { href: "/oeuvres", label: "Oeuvres" },
  { href: "/expositions", label: "Expositions" },
  { href: "/nous-rejoindre", label: "Rejoindre" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-linen/90 backdrop-blur-md sticky top-0 z-50">
      <a href="#main" className="skip-link">Aller au contenu principal</a>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        <Logo />

        <nav className="hidden lg:flex items-center gap-8" aria-label="Navigation principale">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-stone hover:text-charcoal transition-colors tracking-wide py-3"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-3 text-charcoal"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            {open ? (
              <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
            ) : (
              <><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="17" x2="20" y2="17" /></>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="lg:hidden bg-linen border-t border-stone/10 pb-4"
          aria-label="Navigation principale mobile"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-6 py-4 text-stone hover:text-charcoal transition-colors min-h-11"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
