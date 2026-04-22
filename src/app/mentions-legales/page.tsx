import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site Les Peintres de Royan : éditeur, hébergeur, propriété intellectuelle, contact.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegales() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-12 leading-tight">
        Mentions légales
      </h1>

      <div className="space-y-10 text-charcoal-light leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">Éditeur du site</h2>
          <p>
            <strong className="text-charcoal">Les Peintres de Royan</strong>
            <br />
            Association régie par la loi du 1<sup>er</sup> juillet 1901
            <br />
            Siège social : 14 avenue des Platanes, 17200 Royan, France
            <br />
            Email :{" "}
            <a
              href="mailto:lespeintresderoyan@gmail.com"
              className="text-sienna hover:underline"
            >
              lespeintresderoyan@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">Directrice de la publication</h2>
          <p>
            Catherine Delcan, présidente et fondatrice de l&apos;association
            Les Peintres de Royan.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">Hébergement</h2>
          <p>
            Le site est hébergé par <strong className="text-charcoal">Vercel Inc.</strong>
            <br />
            440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
            <br />
            Site web :{" "}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sienna hover:underline"
            >
              vercel.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des contenus présents sur ce site (textes, photographies
            d&apos;œuvres, portraits d&apos;artistes, logos, structure) est protégé par
            le droit d&apos;auteur. Les œuvres reproduites restent la propriété
            exclusive de leurs auteurs. Toute reproduction, même partielle, sans
            autorisation écrite préalable est interdite.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">Crédits</h2>
          <p>
            Conception et développement du site :{" "}
            <a
              href="mailto:zadig2026@gmail.com"
              className="text-sienna hover:underline"
            >
              Zadig
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-charcoal mb-3">Contact</h2>
          <p>
            Pour toute question concernant le site ou l&apos;association, écrivez à{" "}
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
