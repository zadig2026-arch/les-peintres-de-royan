import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Libre_Baskerville, DM_Sans } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#F5F0EB",
};

export const metadata: Metadata = {
  title: {
    default: "Les Peintres de Royan — Collectif d'art contemporain",
    template: "%s — Les Peintres de Royan",
  },
  description:
    "Association d'artistes amateurs réunis autour de l'Art Contemporain à Royan. Expositions et Journées de la Peinture en Charente-Maritime.",
  metadataBase: new URL("https://lespeintresderoyan.fr"),
  alternates: { canonical: "/" },
  manifest: "/manifest.json",
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
      "Association d'artistes amateurs réunis autour de l'Art Contemporain à Royan. Expositions et Journées de la Peinture en Charente-Maritime.",
    images: [
      {
        url: "/images/site/logo-pr.png",
        width: 800,
        height: 800,
        alt: "Les Peintres de Royan — Collectif d'art contemporain",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Les Peintres de Royan — Collectif d'art contemporain",
    description:
      "Association d'artistes amateurs réunis autour de l'Art Contemporain à Royan. Expositions et Journées de la Peinture en Charente-Maritime.",
    images: ["/images/site/logo-pr.png"],
  },
  verification: {
    // Remplacer par le code fourni dans Google Search Console (paramètres → propriété → balise HTML).
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
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
              "@type": ["Organization", "LocalBusiness"],
              "@id": "https://lespeintresderoyan.fr/#organization",
              name: "Les Peintres de Royan",
              alternateName: "Collectif Les Peintres de Royan",
              url: "https://lespeintresderoyan.fr",
              logo: "https://lespeintresderoyan.fr/images/site/logo-pr.png",
              image: "https://lespeintresderoyan.fr/images/site/logo-pr.png",
              description:
                "Association d'artistes amateurs réunis autour de l'Art Contemporain à Royan. Expositions et Journées de la Peinture en Charente-Maritime.",
              foundingDate: "2015",
              email: "lespeintresderoyan@gmail.com",
              telephone: "+33651764244",
              address: {
                "@type": "PostalAddress",
                streetAddress: "14 avenue des Platanes",
                postalCode: "17200",
                addressLocality: "Royan",
                addressRegion: "Charente-Maritime",
                addressCountry: "FR",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 45.6239,
                longitude: -1.0286,
              },
              areaServed: {
                "@type": "Place",
                name: "Charente-Maritime",
              },
              sameAs: [
                "https://www.facebook.com/peintresderoyan/",
                "https://www.instagram.com/lespeintresderoyan/",
              ],
            }),
          }}
        />
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
