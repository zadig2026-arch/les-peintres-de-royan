import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/site";

// Route d'inscription à la newsletter. Le contact est ajouté à une liste Brevo.
// - Si BREVO_DOI_TEMPLATE_ID est défini : double opt-in (Brevo envoie un email
//   de confirmation, le contact n'est ajouté à la liste qu'après clic). Recommandé.
// - Sinon : ajout direct à la liste (simple opt-in).
//
// Variables d'environnement attendues (cf. .env.example) :
//   BREVO_API_KEY            (obligatoire)
//   BREVO_LIST_ID            (obligatoire, id numérique de la liste)
//   BREVO_DOI_TEMPLATE_ID    (optionnel, active le double opt-in)
//   BREVO_DOI_REDIRECT_URL   (optionnel, page de remerciement après confirmation)

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MESSAGE_DOI =
  "Merci ! Vérifiez votre boîte mail pour confirmer votre inscription.";
const MESSAGE_DIRECT =
  "Merci ! Votre inscription à la newsletter est confirmée.";

export async function POST(request: Request) {
  let body: { email?: unknown; consent?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const consent = body.consent === true;

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "Adresse e-mail invalide." },
      { status: 400 }
    );
  }

  if (!consent) {
    return NextResponse.json(
      { error: "Le consentement est requis pour s'inscrire." },
      { status: 400 }
    );
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  const doiTemplateId = process.env.BREVO_DOI_TEMPLATE_ID
    ? Number(process.env.BREVO_DOI_TEMPLATE_ID)
    : undefined;
  const redirectUrl =
    process.env.BREVO_DOI_REDIRECT_URL ||
    `${SITE_URL}/?newsletter=confirmee`;

  if (!apiKey || !Number.isFinite(listId)) {
    console.error(
      "Newsletter : BREVO_API_KEY ou BREVO_LIST_ID manquant/invalide."
    );
    return NextResponse.json(
      { error: "Le service d'inscription est momentanément indisponible." },
      { status: 503 }
    );
  }

  const useDoi = Number.isFinite(doiTemplateId);
  const endpoint = useDoi
    ? "https://api.brevo.com/v3/contacts/doubleOptinConfirmation"
    : "https://api.brevo.com/v3/contacts";

  const payload = useDoi
    ? {
        email,
        includeListIds: [listId],
        templateId: doiTemplateId,
        redirectionUrl: redirectUrl,
      }
    : {
        email,
        listIds: [listId],
        updateEnabled: true,
      };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    // 201 (créé) et 204 (mis à jour / DOI envoyé) = succès.
    if (res.ok) {
      return NextResponse.json({
        ok: true,
        message: useDoi ? MESSAGE_DOI : MESSAGE_DIRECT,
      });
    }

    const data = await res.json().catch(() => ({}));

    // Contact déjà présent : on traite ça comme un succès côté visiteur.
    if (
      res.status === 400 &&
      typeof data?.code === "string" &&
      data.code === "duplicate_parameter"
    ) {
      return NextResponse.json({
        ok: true,
        message: "Vous êtes déjà inscrit à notre newsletter. Merci !",
      });
    }

    console.error("Newsletter : erreur Brevo", res.status, data);
    return NextResponse.json(
      { error: "Inscription impossible pour le moment. Merci de réessayer." },
      { status: 502 }
    );
  } catch (err) {
    console.error("Newsletter : échec de l'appel Brevo", err);
    return NextResponse.json(
      { error: "Inscription impossible pour le moment. Merci de réessayer." },
      { status: 502 }
    );
  }
}
