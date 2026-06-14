import { NextResponse } from "next/server";

import { writeClient } from "@/lib/sanity";

// Compteur de visites — stockage Sanity (document `visitCounter`, hors Studio),
// même approche que les sites GPPR et Bernard Devisme. Le site n'a pas d'autre
// contenu Sanity ; tout le reste vit en markdown sous content/.
//
// POST : enregistre une visite (incrémente le total) et renvoie { ok, total }.
// GET  : lit le total sans l'incrémenter.
//
// La déduplication (une visite par session) est gérée côté client
// (CompteurVisites, marqueur sessionStorage). Sans token Sanity, le client vaut
// null, la route répond 503 et le compteur reste masqué dans le pied de page.
//
// Appelée publiquement via le rewrite /ln (next.config.ts) pour échapper aux
// bloqueurs de pub qui filtrent les URLs contenant « visit ».

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DOC_ID = "visitCounter";

type CounterDoc = { total?: number };

function offset(): number {
  const brut = Number(process.env.VISITES_OFFSET);
  return Number.isFinite(brut) ? brut : 0;
}

async function lireTotal(): Promise<number> {
  const doc = await writeClient!.fetch<CounterDoc | null>(
    `*[_id == $id][0]{total}`,
    { id: DOC_ID }
  );
  return doc?.total ?? 0;
}

export async function GET() {
  if (!writeClient) {
    return NextResponse.json(
      { ok: false, error: "Compteur non configuré." },
      { status: 503 }
    );
  }
  try {
    return NextResponse.json({ ok: true, total: (await lireTotal()) + offset() });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Compteur momentanément indisponible." },
      { status: 502 }
    );
  }
}

export async function POST() {
  if (!writeClient) {
    return NextResponse.json(
      { ok: false, error: "Compteur non configuré." },
      { status: 503 }
    );
  }
  try {
    // Garantit l'existence du document au premier passage, puis incrémente.
    await writeClient.createIfNotExists({
      _id: DOC_ID,
      _type: "visitCounter",
      total: 0,
    });
    const updated = await writeClient
      .patch(DOC_ID)
      .setIfMissing({ total: 0 })
      .inc({ total: 1 })
      .commit();
    const total = (updated as CounterDoc).total ?? (await lireTotal());
    return NextResponse.json({ ok: true, total: total + offset() });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Compteur momentanément indisponible." },
      { status: 502 }
    );
  }
}
