import { createClient } from "@sanity/client";

// Client Sanity avec droits d'écriture — STRICTEMENT côté serveur (route
// handlers). Sert uniquement au compteur de visites ; tout le contenu éditorial
// du site vit en markdown sous content/, pas dans Sanity. Même approche que les
// sites GPPR et Bernard Devisme.
//
// Variables d'environnement (cf. .env.example) :
//   NEXT_PUBLIC_SANITY_PROJECT_ID  (obligatoire)
//   NEXT_PUBLIC_SANITY_DATASET     (obligatoire, ex. "production")
//   NEXT_PUBLIC_SANITY_API_VERSION (optionnel, défaut 2026-01-01)
//   SANITY_API_WRITE_TOKEN         (obligatoire pour écrire, jamais exposé au client)
//
// Si le projectId ou le token manquent, le client vaut null et la route compteur
// dégrade proprement (503 -> compteur masqué).

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-01-01";
const token = process.env.SANITY_API_WRITE_TOKEN;

export const writeClient =
  projectId && token
    ? createClient({ projectId, dataset, apiVersion, token, useCdn: false })
    : null;
