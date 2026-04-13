import type { Metadata } from "next";
import Script from "next/script";
import { Libre_Baskerville, DM_Sans } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Les Peintres de Royan — Collectif d'art contemporain",
    template: "%s — Les Peintres de Royan",
  },
  description:
    "Collectif de 23 artistes contemporains à Royan. Peinture, dessin, gravure, sculpture. Expositions en Charente-Maritime.",
  metadataBase: new URL("https://lespeintresderoyan.fr"),
  icons: {
    icon: "/images/site/logo-pr.png",
    apple: "/images/site/logo-pr.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Les Peintres de Royan",
    title: "Les Peintres de Royan — Collectif d'art contemporain",
    description:
      "Collectif de 23 artistes contemporains à Royan. Peinture, dessin, gravure, sculpture. Expositions en Charente-Maritime.",
  },
  twitter: {
    card: "summary",
    title: "Les Peintres de Royan — Collectif d'art contemporain",
    description:
      "Collectif de 23 artistes contemporains à Royan. Peinture, dessin, gravure, sculpture. Expositions en Charente-Maritime.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${libreBaskerville.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Les Peintres de Royan",
              url: "https://lespeintresderoyan.fr",
              logo: "https://lespeintresderoyan.fr/images/site/logo-pr.png",
              description:
                "Collectif de 23 artistes contemporains à Royan. Peinture, dessin, gravure, sculpture. Expositions en Charente-Maritime.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Royan",
                addressRegion: "Charente-Maritime",
                addressCountry: "FR",
              },
              sameAs: [
                "https://www.facebook.com/peintresderoyan/",
              ],
            }),
          }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Script
          src="https://identity.netlify.com/v1/netlify-identity-widget.js"
          strategy="lazyOnload"
        />
        <Script id="netlify-identity-redirect" strategy="lazyOnload">
          {`
            if (window.netlifyIdentity) {
              window.netlifyIdentity.on("init", function(user) {
                if (!user) {
                  window.netlifyIdentity.on("login", function() {
                    document.location.href = "/admin/";
                  });
                }
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
