import { getExpositionsActuelles, getExpositionsPassees } from "@/lib/content";
import ExhibitionCard from "@/components/ui/ExhibitionCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expositions",
  description: "Les expositions des Peintres de Royan en Charente-Maritime.",
};

export default function ExpositionsPage() {
  const actuelles = getExpositionsActuelles();
  const passees = getExpositionsPassees();

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-3">Expositions</h1>
      <p className="text-stone text-lg mb-16">Nos rendez-vous artistiques</p>

      {actuelles.length > 0 && (
        <section className="mb-20">
          <p className="text-xs uppercase tracking-[0.2em] text-sienna mb-8">À venir</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {actuelles.map((expo) => (
              <ExhibitionCard key={expo.slug} expo={expo} />
            ))}
          </div>
        </section>
      )}

      {passees.length > 0 && (
        <section>
          <p className="text-xs uppercase tracking-[0.2em] text-stone mb-8">Passées</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {passees.map((expo) => (
              <ExhibitionCard key={expo.slug} expo={expo} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
