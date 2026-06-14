import { NextResponse } from "next/server";

// Compteur de visites du site. Le total est stocké dans Upstash Redis (une seule
// clé entière, incrémentée à chaque nouvelle visite) et lu via l'API REST
// Upstash en `fetch` direct, comme la route newsletter avec Brevo : aucune
// dépendance npm supplémentaire.
//
// Variables d'environnement attendues (cf. .env.example) :
//   UPSTASH_REDIS_REST_URL    (obligatoire) — injecté par l'intégration Upstash sur Vercel
//   UPSTASH_REDIS_REST_TOKEN  (obligatoire) — idem
//   VISITES_OFFSET            (optionnel) — base ajoutée au total affiché, pour ne
//                              pas repartir de 0 sur un site déjà en ligne (défaut 0)
//
// Pour rester compatible avec l'ancienne intégration Vercel KV, les noms
// KV_REST_API_URL / KV_REST_API_TOKEN sont acceptés en repli.
//
// Tant que l'URL et le token ne sont pas renseignés, la route répond 503 et le
// compteur reste simplement masqué côté visiteur (aucune erreur affichée).

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CLE = "visites:total";

function offset(): number {
  const brut = Number(process.env.VISITES_OFFSET);
  return Number.isFinite(brut) ? brut : 0;
}

type Resultat =
  | { statut: "non-configure" }
  | { statut: "erreur" }
  | { statut: "ok"; valeur: number };

// Exécute une commande sur l'API REST Upstash, ex. `incr/visites:total` ou
// `get/visites:total`. Renvoie la valeur entière, ou un statut d'échec.
async function upstash(commande: string): Promise<Resultat> {
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) return { statut: "non-configure" };

  try {
    const res = await fetch(`${url}/${commande}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Compteur : réponse Upstash", res.status);
      return { statut: "erreur" };
    }

    const data = (await res.json()) as { result?: number | string | null };
    // `incr` renvoie un number ; `get` une string, ou null si la clé n'existe
    // pas encore (premier passage) — traité comme 0.
    const valeur = data.result == null ? 0 : Number(data.result);
    return { statut: "ok", valeur: Number.isFinite(valeur) ? valeur : 0 };
  } catch (err) {
    console.error("Compteur : échec de l'appel Upstash", err);
    return { statut: "erreur" };
  }
}

function reponse(r: Resultat) {
  if (r.statut === "non-configure") {
    return NextResponse.json(
      { ok: false, error: "Compteur non configuré." },
      { status: 503 }
    );
  }
  if (r.statut === "erreur") {
    return NextResponse.json(
      { ok: false, error: "Compteur momentanément indisponible." },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true, total: r.valeur + offset() });
}

// GET : lit le total sans l'incrémenter (visiteur déjà compté dans la session).
export async function GET() {
  return reponse(await upstash(`get/${CLE}`));
}

// POST : incrémente puis renvoie le nouveau total (nouvelle visite).
export async function POST() {
  return reponse(await upstash(`incr/${CLE}`));
}
