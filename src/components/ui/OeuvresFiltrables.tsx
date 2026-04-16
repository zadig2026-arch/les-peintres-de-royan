"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import OeuvresCarousel from "./OeuvresCarousel";

interface OeuvreAvecMeta {
  titre: string;
  image: string;
  annee?: string;
  technique?: string;
  dimensions?: string;
  serie?: string;
  artisteNom: string;
  artisteSlug: string;
}

type ModeTri = "tous" | "artiste" | "recent";
type ModeVue = "grille" | "carrousel";

interface Props {
  oeuvres: OeuvreAvecMeta[];
}

export default function OeuvresFiltrables({ oeuvres }: Props) {
  const [modeTri, setModeTri] = useState<ModeTri>("tous");
  const [modeVue, setModeVue] = useState<ModeVue>("grille");

  const groupes = useMemo(() => {
    if (modeTri === "tous") {
      return [{ label: null as string | null, items: oeuvres }];
    }

    if (modeTri === "recent") {
      const sorted = [...oeuvres].reverse();
      return [{ label: null as string | null, items: sorted }];
    }

    // Par artiste
    const map = new Map<string, OeuvreAvecMeta[]>();
    oeuvres.forEach((o) => {
      const key = o.artisteNom;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(o);
    });

    const entries = [...map.entries()].sort((a, b) =>
      a[0].localeCompare(b[0], "fr")
    );

    return entries.map(([label, items]) => ({ label, items }));
  }, [oeuvres, modeTri]);

  const pillBase =
    "text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer whitespace-nowrap";
  const pillInactif = `${pillBase} text-stone border border-stone/20 hover:border-sienna/50`;
  const pillActif = `${pillBase} text-white bg-sienna border border-sienna`;

  return (
    <div>
      {/* Barre d'options : tri + vue */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-10">
        {/* Tri à gauche */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-stone/60 uppercase tracking-wider mr-1">
            Trier par
          </span>
          <button
            onClick={() => setModeTri("tous")}
            className={modeTri === "tous" ? pillActif : pillInactif}
          >
            Toutes les œuvres
          </button>
          <button
            onClick={() => setModeTri("artiste")}
            className={modeTri === "artiste" ? pillActif : pillInactif}
          >
            Par artiste
          </button>
          <button
            onClick={() => setModeTri("recent")}
            className={modeTri === "recent" ? pillActif : pillInactif}
          >
            Ajouts récents
          </button>
        </div>

        {/* Affichage à droite */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone/60 uppercase tracking-wider mr-1">
            Affichage
          </span>
          <button
            onClick={() => setModeVue("grille")}
            className={modeVue === "grille" ? pillActif : pillInactif}
          >
            Grille
          </button>
          <button
            onClick={() => setModeVue("carrousel")}
            className={modeVue === "carrousel" ? pillActif : pillInactif}
          >
            Carrousel
          </button>
        </div>
      </div>

      {/* Contenu : grille ou carrousel */}
      {modeVue === "grille" ? (
        <>
          {groupes.map((groupe, gi) => (
            <div key={groupe.label ?? "all"} className={gi > 0 ? "mt-14" : ""}>
              {groupe.label && (
                <h2 className="font-serif text-2xl text-charcoal mb-6">
                  {groupe.label}
                  <span className="text-stone text-sm font-sans ml-3">
                    {groupe.items.length} œuvre
                    {groupe.items.length !== 1 && "s"}
                  </span>
                </h2>
              )}

              <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-1.5">
                {groupe.items.map((oeuvre, i) => (
                  <Link
                    key={`${oeuvre.artisteSlug}-${oeuvre.titre}-${i}`}
                    href={`/artistes/${oeuvre.artisteSlug}`}
                    className="group relative block mb-1.5 break-inside-avoid rounded-sm overflow-hidden bg-cream"
                  >
                    <img
                      src={oeuvre.image}
                      alt={`${oeuvre.titre} — ${oeuvre.artisteNom}`}
                      className="w-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <div>
                        <p className="text-white text-sm font-serif leading-tight">
                          {oeuvre.artisteNom}
                        </p>
                        {oeuvre.titre &&
                          !oeuvre.titre.match(/^Oeuvre \d+$/i) && (
                            <p className="text-white/70 text-xs mt-0.5">
                              {oeuvre.titre}
                            </p>
                          )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </>
      ) : (
        <OeuvresCarousel
          key={modeTri}
          items={groupes.flatMap((g) => g.items)}
        />
      )}
    </div>
  );
}
