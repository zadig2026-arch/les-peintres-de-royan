import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Le compteur de visites est appelé via /ln, réécrit vers la route API, pour
  // échapper aux bloqueurs de pub qui filtrent les URLs contenant « visit ».
  async rewrites() {
    return [{ source: "/ln", destination: "/api/visites" }];
  },
  // En-têtes de sécurité de base (pas de CSP : les scripts JSON-LD inline et
  // Vercel Analytics demanderaient une politique fine, hors de proportion ici).
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
