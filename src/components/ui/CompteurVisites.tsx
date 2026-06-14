"use client";

import { useEffect, useState } from "react";

// Affiche le nombre total de visites du site, lu/incrémenté via /api/visites.
// - Une visite n'est comptée qu'une fois par session de navigation (marqueur
//   sessionStorage), pour ne pas gonfler le total à chaque page consultée.
// - Si le compteur n'est pas configuré ou est indisponible, le composant ne
//   rend rien : pas de « 0 visite » ni de message d'erreur dans le pied de page.

const CLE_SESSION = "lpr_visite_comptee";

export default function CompteurVisites() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    let actif = true;

    async function charger() {
      // Première page de la session → on incrémente (POST). Sinon on lit (GET).
      let dejaCompte: boolean;
      try {
        dejaCompte = sessionStorage.getItem(CLE_SESSION) === "1";
      } catch {
        // sessionStorage indisponible (navigation privée stricte) : on se
        // contente de lire le total sans l'incrémenter.
        dejaCompte = true;
      }

      try {
        // Appel via /ln (réécrit vers /api/visites) pour passer sous le radar
        // des bloqueurs de pub.
        const res = await fetch("/ln", {
          method: dejaCompte ? "GET" : "POST",
        });
        if (!res.ok) return;

        const data = (await res.json()) as { ok?: boolean; total?: number };
        if (!actif || !data.ok || typeof data.total !== "number") return;

        setTotal(data.total);
        if (!dejaCompte) {
          try {
            sessionStorage.setItem(CLE_SESSION, "1");
          } catch {
            /* sessionStorage indisponible : sans gravité */
          }
        }
      } catch {
        // Silencieux : en cas d'échec, on n'affiche simplement pas le compteur.
      }
    }

    charger();
    return () => {
      actif = false;
    };
  }, []);

  if (total === null) return null;

  const formate = new Intl.NumberFormat("fr-FR").format(total);
  const label = total > 1 ? "visites" : "visite";

  return (
    <span className="py-3 tabular-nums" title={`${formate} ${label} depuis la mise en ligne`}>
      {formate} {label}
    </span>
  );
}
