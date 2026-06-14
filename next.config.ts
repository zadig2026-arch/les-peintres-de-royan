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
};

export default nextConfig;
