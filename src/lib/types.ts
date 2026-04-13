export interface Oeuvre {
  titre: string;
  image: string;
  annee?: string;
  technique?: string;
  dimensions?: string;
}

export interface OeuvreFichier extends Oeuvre {
  artiste_slug: string;
  slug: string;
}

export interface Artiste {
  nom: string;
  slug: string;
  role?: string;
  portrait?: string;
  bio: string;
  techniques: string[];
  site_web?: string;
  instagram?: string;
  ordre: number;
  visible: boolean;
  oeuvres: Oeuvre[];
}

export interface Exposition {
  titre: string;
  slug: string;
  lieu: string;
  date_debut: string;
  date_fin: string;
  horaires: string;
  statut: "en-cours" | "a-venir" | "passee";
  entree_libre: boolean;
  image_principale?: string;
  description: string;
  photos_galerie: string[];
  visible: boolean;
}

export interface PageAccueil {
  hero_titre: string;
  hero_sous_titre: string;
  hero_image: string;
  section_presentation: string;
}

export interface PageCollectif {
  titre: string;
  histoire: string;
  philosophie: string;
  image_groupe?: string;
}

export interface PageRejoindre {
  titre: string;
  intro: string;
  cotisation: string;
  processus: string;
}

export interface PageContact {
  email: string;
  telephone: string;
  adresse: string;
  facebook?: string;
  instagram?: string;
}
