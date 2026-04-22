import { getPageRejoindre } from "@/lib/content";
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
      <div className="bg-white border border-stone/15 rounded-xl shadow-sm p-8 md:p-10">
        <h2 className="font-serif text-2xl text-charcoal mb-2">
          Fiche de candidature
        </h2>
        <p className="text-sm text-charcoal-light mb-8">
          Remplissez ce formulaire et envoyez-le par email à{" "}
          <a
            href="mailto:lespeintresderoyan@gmail.com"
            className="text-sienna hover:underline"
          >
            lespeintresderoyan@gmail.com
          </a>{" "}
          accompagné de 6 photos de vos oeuvres.
        </p>

        <form className="space-y-6" action={`mailto:lespeintresderoyan@gmail.com`} method="GET">
          {/* Identité */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-sienna uppercase tracking-wide mb-2">
              Identité
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nom" className="block text-sm text-charcoal mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-stone/15 bg-linen text-charcoal focus:outline-none focus:ring-2 focus:ring-sienna/30 focus:border-sienna transition-colors"
                />
              </div>
              <div>
                <label htmlFor="prenom" className="block text-sm text-charcoal mb-1">
                  Prénom *
                </label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-stone/15 bg-linen text-charcoal focus:outline-none focus:ring-2 focus:ring-sienna/30 focus:border-sienna transition-colors"
                />
              </div>
            </div>
            <div>
              <label htmlFor="pseudo" className="block text-sm text-charcoal mb-1">
                Pseudo d&apos;artiste (si applicable)
              </label>
              <input
                type="text"
                id="pseudo"
                name="pseudo"
                className="w-full px-4 py-2.5 rounded-lg border border-stone/15 bg-linen text-charcoal focus:outline-none focus:ring-2 focus:ring-sienna/30 focus:border-sienna transition-colors"
              />
            </div>
            <div>
              <label htmlFor="naissance" className="block text-sm text-charcoal mb-1">
                Date et lieu de naissance
              </label>
              <input
                type="text"
                id="naissance"
                name="naissance"
                placeholder="Ex : 15 mars 1965, Bordeaux"
                className="w-full px-4 py-2.5 rounded-lg border border-stone/15 bg-linen text-charcoal placeholder:text-charcoal-light/40 focus:outline-none focus:ring-2 focus:ring-sienna/30 focus:border-sienna transition-colors"
              />
            </div>
          </fieldset>

          {/* Pratique artistique */}
          <fieldset className="space-y-4 pt-4 border-t border-stone/15">
            <legend className="text-sm font-semibold text-sienna uppercase tracking-wide mb-2">
              Pratique artistique
            </legend>
            <div>
              <label htmlFor="disciplines" className="block text-sm text-charcoal mb-1">
                Discipline(s) artistique(s) pratiquée(s) *
              </label>
              <input
                type="text"
                id="disciplines"
                name="disciplines"
                required
                placeholder="Ex : Peinture à l'huile, acrylique, gravure..."
                className="w-full px-4 py-2.5 rounded-lg border border-stone/15 bg-linen text-charcoal placeholder:text-charcoal-light/40 focus:outline-none focus:ring-2 focus:ring-sienna/30 focus:border-sienna transition-colors"
              />
            </div>
            <div>
              <label htmlFor="demarche" className="block text-sm text-charcoal mb-1">
                Démarche artistique *
              </label>
              <textarea
                id="demarche"
                name="demarche"
                required
                rows={4}
                placeholder="Décrivez votre travail, vos thèmes de prédilection, votre parcours..."
                className="w-full px-4 py-2.5 rounded-lg border border-stone/15 bg-linen text-charcoal placeholder:text-charcoal-light/40 focus:outline-none focus:ring-2 focus:ring-sienna/30 focus:border-sienna transition-colors resize-y"
              />
            </div>
          </fieldset>

          {/* Coordonnées */}
          <fieldset className="space-y-4 pt-4 border-t border-stone/15">
            <legend className="text-sm font-semibold text-sienna uppercase tracking-wide mb-2">
              Coordonnées
            </legend>
            <div>
              <label htmlFor="adresse" className="block text-sm text-charcoal mb-1">
                Adresse *
              </label>
              <input
                type="text"
                id="adresse"
                name="adresse"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-stone/15 bg-linen text-charcoal focus:outline-none focus:ring-2 focus:ring-sienna/30 focus:border-sienna transition-colors"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="code_postal" className="block text-sm text-charcoal mb-1">
                  Code postal *
                </label>
                <input
                  type="text"
                  id="code_postal"
                  name="code_postal"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-stone/15 bg-linen text-charcoal focus:outline-none focus:ring-2 focus:ring-sienna/30 focus:border-sienna transition-colors"
                />
              </div>
              <div>
                <label htmlFor="commune" className="block text-sm text-charcoal mb-1">
                  Commune *
                </label>
                <input
                  type="text"
                  id="commune"
                  name="commune"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-stone/15 bg-linen text-charcoal focus:outline-none focus:ring-2 focus:ring-sienna/30 focus:border-sienna transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tel_portable" className="block text-sm text-charcoal mb-1">
                  Téléphone portable *
                </label>
                <input
                  type="tel"
                  id="tel_portable"
                  name="tel_portable"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-stone/15 bg-linen text-charcoal focus:outline-none focus:ring-2 focus:ring-sienna/30 focus:border-sienna transition-colors"
                />
              </div>
              <div>
                <label htmlFor="tel_fixe" className="block text-sm text-charcoal mb-1">
                  Téléphone fixe
                </label>
                <input
                  type="tel"
                  id="tel_fixe"
                  name="tel_fixe"
                  className="w-full px-4 py-2.5 rounded-lg border border-stone/15 bg-linen text-charcoal focus:outline-none focus:ring-2 focus:ring-sienna/30 focus:border-sienna transition-colors"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-charcoal mb-1">
                Adresse e-mail *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-stone/15 bg-linen text-charcoal focus:outline-none focus:ring-2 focus:ring-sienna/30 focus:border-sienna transition-colors"
              />
            </div>
          </fieldset>

          {/* Présence en ligne */}
          <fieldset className="space-y-4 pt-4 border-t border-stone/15">
            <legend className="text-sm font-semibold text-sienna uppercase tracking-wide mb-2">
              Présence en ligne
            </legend>
            <div>
              <label htmlFor="site_web" className="block text-sm text-charcoal mb-1">
                Site web ou blog
              </label>
              <input
                type="url"
                id="site_web"
                name="site_web"
                placeholder="https://"
                className="w-full px-4 py-2.5 rounded-lg border border-stone/15 bg-linen text-charcoal placeholder:text-charcoal-light/40 focus:outline-none focus:ring-2 focus:ring-sienna/30 focus:border-sienna transition-colors"
              />
            </div>
            <div>
              <label htmlFor="facebook" className="block text-sm text-charcoal mb-1">
                Page ou profil Facebook
              </label>
              <input
                type="text"
                id="facebook"
                name="facebook"
                className="w-full px-4 py-2.5 rounded-lg border border-stone/15 bg-linen text-charcoal focus:outline-none focus:ring-2 focus:ring-sienna/30 focus:border-sienna transition-colors"
              />
            </div>
          </fieldset>

          {/* Note */}
          <div className="bg-cream/50 rounded-lg p-5 text-sm text-charcoal-light">
            <p>
              <strong className="text-charcoal">Rappel :</strong> Joignez 6 photos
              de vos oeuvres (JPEG, 300 dpi) à votre email de candidature, ainsi
              qu&apos;une photo d&apos;identité. Le chèque de cotisation est à envoyer par
              courrier à : Les Peintres de Royan, 14 avenue des Platanes, 17200
              Royan.
            </p>
            <p className="mt-2">
              Les dossiers des artistes non retenus seront renvoyés.
            </p>
          </div>

          {/* Submit */}
          <div className="text-center pt-4">
            <button
              type="submit"
              className="inline-block bg-charcoal hover:bg-charcoal-dark text-linen font-semibold px-10 py-3.5 rounded-full transition-colors text-lg"
            >
              Envoyer ma candidature
            </button>
            <p className="text-xs text-charcoal-light mt-3">
              Ce bouton ouvrira votre application email avec les informations pré-remplies.
            </p>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
