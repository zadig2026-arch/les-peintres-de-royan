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
