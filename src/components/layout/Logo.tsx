import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <img
        src="/images/site/logo-pr.jpg"
        alt="PR"
        className="w-9 h-9 rounded-sm object-cover"
      />
      <span className="font-serif text-sm tracking-wide text-charcoal leading-tight">
        Les Peintres <span className="text-stone">de Royan</span>
      </span>
    </Link>
  );
}
