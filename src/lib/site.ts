// Adresse canonique du site. Vercel redirige l'apex (lespeintresderoyan.fr)
// vers www en 308 : toutes les URLs absolues (canonical, sitemap, JSON-LD,
// Open Graph) doivent donc pointer sur www pour ne pas renvoyer vers une
// redirection. À garder synchronisé avec public/robots.txt.
export const SITE_URL = "https://www.lespeintresderoyan.fr";
