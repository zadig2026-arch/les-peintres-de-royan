"use client";

import { useCallback, useEffect, useState } from "react";
import NewsletterForm from "./NewsletterForm";

// Pop-up discret d'inscription à la newsletter, glissant depuis le coin bas-droite.
// Ne s'affiche qu'une fois (mémorisé via localStorage) : ni après fermeture, ni
// après inscription. Apparaît après un court délai pour rester non intrusif.

const STORAGE_KEY = "lpr-newsletter-popup-v1";
const DELAY_MS = 6000;

function remember(value: string) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* localStorage indisponible : on ignore */
  }
}

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(false); // pilote l'animation d'entrée/sortie

  useEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen = !!localStorage.getItem(STORAGE_KEY);
    } catch {
      /* localStorage indisponible : on affiche quand même */
    }
    if (alreadySeen) return;

    const timer = setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(() => setShown(true));
    }, DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const close = useCallback(() => {
    setShown(false);
    setTimeout(() => setVisible(false), 300);
  }, []);

  const dismiss = useCallback(() => {
    remember("dismissed");
    close();
  }, [close]);

  function handleSuccess() {
    remember("subscribed");
    // Laisse le visiteur lire le message de confirmation avant la fermeture.
    setTimeout(close, 4000);
  }

  useEffect(() => {
    if (!visible) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, dismiss]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Inscription à la newsletter"
      className={`fixed z-50 bottom-4 right-4 left-4 sm:left-auto sm:max-w-sm transition-all duration-300 ease-out ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="relative bg-white border border-stone/15 rounded-xl shadow-xl p-6 pr-10">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Fermer"
          className="absolute top-3 right-3 h-7 w-7 flex items-center justify-center rounded-full text-stone hover:text-charcoal hover:bg-cream transition-colors text-lg leading-none"
        >
          &times;
        </button>
        <NewsletterForm variant="compact" onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
