"use client";

import { useState } from "react";

type Statut = "idle" | "loading" | "success" | "error";

type NewsletterFormProps = {
  /**
   * `compact` : version pied de page (champ + bouton sur une ligne, libellés courts).
   * `block` : version encadrée pour une section dédiée (titre, texte d'accroche).
   */
  variant?: "compact" | "block";
  className?: string;
  /** Appelé une fois l'inscription réussie (ex. pour fermer une pop-up). */
  onSuccess?: () => void;
};

const MESSAGE_SUCCES =
  "Merci ! Vérifiez votre boîte mail pour confirmer votre inscription.";
const MESSAGE_ERREUR =
  "Une erreur est survenue. Merci de réessayer dans un instant.";

export default function NewsletterForm({
  variant = "compact",
  className = "",
  onSuccess,
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [statut, setStatut] = useState<Statut>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (statut === "loading") return;

    if (!consent) {
      setStatut("error");
      setMessage("Merci de cocher la case de consentement avant de valider.");
      return;
    }

    setStatut("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatut("success");
        setMessage(data.message || MESSAGE_SUCCES);
        setEmail("");
        setConsent(false);
        onSuccess?.();
      } else {
        setStatut("error");
        setMessage(data.error || MESSAGE_ERREUR);
      }
    } catch {
      setStatut("error");
      setMessage(MESSAGE_ERREUR);
    }
  }

  const inputClasses =
    "w-full px-4 py-2.5 rounded-lg border border-stone/15 bg-linen text-charcoal placeholder:text-charcoal-light/40 focus:outline-none focus:ring-2 focus:ring-sienna/30 focus:border-sienna transition-colors";

  const consentField = (
    <label className="flex items-start gap-2.5 text-xs text-charcoal-light leading-relaxed cursor-pointer">
      <input
        type="checkbox"
        checked={consent}
        onChange={(e) => setConsent(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-sienna"
        aria-describedby="newsletter-consent-text"
      />
      <span id="newsletter-consent-text">
        J&apos;accepte de recevoir par email les actualités, expositions et
        événements de l&apos;association. Désinscription possible à tout moment.
      </span>
    </label>
  );

  const feedback = message ? (
    <p
      role="status"
      aria-live="polite"
      className={`text-sm ${
        statut === "success" ? "text-teal" : "text-sienna-dark"
      }`}
    >
      {message}
    </p>
  ) : null;

  if (variant === "block") {
    return (
      <div
        className={`bg-white border border-stone/15 rounded-xl shadow-sm p-8 md:p-10 ${className}`}
      >
        <h2 className="font-serif text-2xl text-charcoal mb-2">
          Restez informé
        </h2>
        <p className="text-sm text-charcoal-light mb-6 max-w-prose">
          Recevez nos actualités, les annonces d&apos;expositions et les
          événements du collectif directement dans votre boîte mail. Pas de spam,
          quelques messages par an.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label
              htmlFor="newsletter-email-block"
              className="block text-sm text-charcoal mb-1"
            >
              Adresse e-mail
            </label>
            <input
              type="email"
              id="newsletter-email-block"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.fr"
              className={inputClasses}
            />
          </div>
          {consentField}
          {feedback}
          <button
            type="submit"
            disabled={statut === "loading"}
            className="inline-block bg-charcoal hover:bg-charcoal-dark text-linen font-semibold px-8 py-3 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {statut === "loading" ? "Inscription…" : "S'inscrire"}
          </button>
        </form>
      </div>
    );
  }

  // variant === "compact" (pied de page)
  return (
    <div className={className}>
      <p className="text-xs uppercase tracking-[0.15em] text-stone mb-2">
        Newsletter
      </p>
      <p className="text-sm text-charcoal-light leading-relaxed mb-3 max-w-sm">
        Expositions et événements de l&apos;association, directement par email.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-sm">
        <div className="flex flex-col sm:flex-row gap-2">
          <label htmlFor="newsletter-email-footer" className="sr-only">
            Adresse e-mail
          </label>
          <input
            type="email"
            id="newsletter-email-footer"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.fr"
            className={inputClasses}
          />
          <button
            type="submit"
            disabled={statut === "loading"}
            className="shrink-0 bg-charcoal hover:bg-charcoal-dark text-linen font-semibold px-6 py-2.5 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {statut === "loading" ? "…" : "S'inscrire"}
          </button>
        </div>
        {consentField}
        {feedback}
      </form>
    </div>
  );
}
