import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  items: Crumb[];
}

const SITE = "https://lespeintresderoyan.fr";

export default function Breadcrumbs({ items }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE },
      ...items.map((c, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: c.label,
        ...(c.href ? { item: `${SITE}${c.href}` } : {}),
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Fil d'Ariane" className="text-xs text-stone">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-sienna transition-colors">
              Accueil
            </Link>
          </li>
          {items.map((c, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <span aria-hidden="true" className="text-stone/50">
                /
              </span>
              {c.href && i < items.length - 1 ? (
                <Link href={c.href} className="hover:text-sienna transition-colors">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-charcoal-light">
                  {c.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
