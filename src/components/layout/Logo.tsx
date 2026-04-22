import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="Les Peintres de Royan — retour à l'accueil">
      <Image
        src="/images/site/logo-pr.jpg"
        alt=""
        width={36}
        height={36}
        priority
        className="w-9 h-9 rounded-sm object-cover"
      />
      <span className="font-serif text-sm tracking-wide text-charcoal leading-tight">
        Les Peintres <span className="text-stone">de Royan</span>
      </span>
    </Link>
  );
}
