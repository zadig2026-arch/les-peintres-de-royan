"use client";

import { useState, useMemo, lazy, Suspense } from "react";
import Link from "next/link";
import ArtworkImage from "./ArtworkImage";
import OeuvresCarousel from "./OeuvresCarousel";

const LazyLightbox = lazy(() => import("./OeuvresLightbox"));

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

function titreGenerique(titre: string): boolean {
  return /^Oeuvre \d+$/i.test(titre);
}

export default function OeuvresFiltrables({ oeuvres }: Props) {
  const [modeTri, setModeTri] = useState<ModeTri>("tous");
  const [modeVue, setModeVue] = useState<ModeVue>("grille");
  const [lightboxIndex, setLightboxIndex] = useState(-1);

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

  // Liste aplatie dans l'ordre d'affichage : la lightbox permet de zoomer et
  // de feuilleter au doigt, là où un tap navigait vers la page artiste sans
  // prévenir. Le lien vers l'artiste vit désormais dans la légende.
  const { slides, offsets } = useMemo(() => {
    const flat = groupes.flatMap((g) => g.items);
    const offs = groupes.reduce<number[]>((acc, g, i) => {
      acc.push(i === 0 ? 0 : acc[i - 1] + groupes[i - 1].items.length);
      return acc;
    }, []);
    return {
      slides: flat.map((o) => ({
        src: o.image,
        alt: `${o.titre} — ${o.artisteNom}`,
        title: titreGenerique(o.titre) ? o.artisteNom : o.titre,
        description: (
          <span>
            {[o.technique, o.dimensions, o.annee].filter(Boolean).join(" — ")}
            {[o.technique, o.dimensions, o.annee].some(Boolean) && <br />}
            <Link
              href={`/artistes/${o.artisteSlug}`}
              className="inline-block py-2 underline underline-offset-4 hover:text-white"
            >
              Voir la page de {o.artisteNom} &rarr;
            </Link>
          </span>
        ),
      })),
      offsets: offs,
    };
  }, [groupes]);

  const pillBase =
    "inline-flex items-center min-h-11 text-sm px-4 py-2 rounded-full transition-colors cursor-pointer whitespace-nowrap";
  const pillInactif = `${pillBase} text-charcoal-light border border-stone/30 hover:border-sienna/50`;
  const pillActif = `${pillBase} text-white bg-sienna border border-sienna`;

  return (
    <div>
      {/* Barre d'options : tri + vue */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-10">
        {/* Tri à gauche */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-stone uppercase tracking-wider mr-1">
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
          <span className="text-xs text-stone uppercase tracking-wider mr-1">
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
                  <button
                    key={`${oeuvre.artisteSlug}-${oeuvre.titre}-${i}`}
                    type="button"
                    onClick={() => setLightboxIndex(offsets[gi] + i)}
                    aria-label={`Agrandir ${oeuvre.titre} de ${oeuvre.artisteNom}`}
                    className="group relative block w-full mb-1.5 break-inside-avoid rounded-sm overflow-hidden bg-cream cursor-zoom-in text-left"
                  >
                    <ArtworkImage
                      src={oeuvre.image}
                      alt={`${oeuvre.titre} — ${oeuvre.artisteNom}`}
                      width={600}
                      height={750}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                      eager={gi === 0 && i < 5}
                      className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 pointer-events-none">
                      <div>
                        <p className="text-white text-sm font-serif leading-tight">
                          {oeuvre.artisteNom}
                        </p>
                        {oeuvre.titre && !titreGenerique(oeuvre.titre) && (
                          <p className="text-white/80 text-xs mt-0.5">
                            {oeuvre.titre}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {lightboxIndex >= 0 && (
            <Suspense fallback={null}>
              <LazyLightbox
                open
                index={lightboxIndex}
                close={() => setLightboxIndex(-1)}
                slides={slides}
              />
            </Suspense>
          )}
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
