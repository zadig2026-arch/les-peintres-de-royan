import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité et protection des données personnelles du site Les Peintres de Royan.",
  alternates: { canonical: "/politique-confidentialite" },
};

export default function PolitiqueConfidentialite() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-4 leading-tight">
        Politique de confidentialité
      </h1>
      <p className="text-sm text-stone mb-12">
        Dernière mise à jour : avril 2026
      </p>

      <div className="space-y-10 text-charcoal-light leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">Principe général</h2>
          <p>
            Le site <strong className="text-charcoal">lespeintresderoyan.fr</strong> est édité
            par une association à but non lucratif. Nous respectons votre vie privée
            et collectons le minimum de données possible, dans le respect du
            Règlement Général sur la Protection des Données (RGPD).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">Cookies</h2>
          <p>
            Ce site <strong className="text-charcoal">ne dépose aucun cookie</strong> de
            publicité, de suivi tiers ou de profilage. Aucune bannière de consentement
            n&apos;est donc nécessaire.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">Mesure d&apos;audience</h2>
          <p>
            Nous utilisons <strong className="text-charcoal">Vercel Analytics</strong> pour
            mesurer la fréquentation du site de manière <strong>anonyme</strong> :
            adresses IP anonymisées, aucune donnée personnelle, aucun cookie.
            Cet outil est conforme au RGPD et ne permet pas d&apos;identifier
            les visiteurs individuellement.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">Formulaire de candidature</h2>
          <p>
            La page <em>Nous rejoindre</em> propose un formulaire qui ouvre votre
            logiciel de messagerie. Les informations que vous y saisissez sont
            envoyées directement à{" "}
            <a
              href="mailto:lespeintresderoyan@gmail.com"
              className="text-sienna hover:underline"
            >
              lespeintresderoyan@gmail.com
            </a>{" "}
            et utilisées uniquement pour étudier votre candidature. Elles ne
            sont ni stockées sur le site, ni partagées à des tiers.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">Hébergement & journaux techniques</h2>
          <p>
            Le site est hébergé par <strong className="text-charcoal">Vercel</strong>.
            Pour assurer le bon fonctionnement et la sécurité du service, Vercel
            peut conserver pendant une courte durée des journaux techniques
            (adresse IP, date, URL demandée). Ces données ne sont pas exploitées
            par l&apos;association.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès,
            de rectification, d&apos;effacement, de limitation et d&apos;opposition
            concernant vos données. Pour exercer ces droits, contactez-nous à{" "}
            <a
              href="mailto:lespeintresderoyan@gmail.com"
              className="text-sienna hover:underline"
            >
              lespeintresderoyan@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
