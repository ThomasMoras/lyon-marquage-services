/**
 * Ce script génère automatiquement les pages pour tous les produits du catalogue
 * basé sur le fichier menuCatalogue.ts
 *
 * Utilisation: pnpm exec tsx scripts/generateCataloguePages.ts
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { menuCatalogue } from "@/constants/catalogue";

// Configuration du chemin pour ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Mapping des slugs vers les paramètres family/subfamily pour l'API TopTex
// Ce mapping doit être complété avec les valeurs correctes pour votre API
const productsMapping = {
  "tshirt": { family: "Vêtements", subfamily: "T-shirt" },
  "polo": { family: "Vêtements", subfamily: "Polo" },
  "sweat": { family: "Vêtements", subfamily: "Sweat" },
  "casquette": { family: "Headwear & Accessoires", subfamily: "Casquette" },
  "bonnet": { family: "Headwear & Accessoires", subfamily: "Bonnet" },
  "veste": { family: "Vêtements", subfamily: "Veste" },
  "bermuda-short": { family: "Vêtements", subfamily: "Bermuda/Short" },
  "body": { family: "Vêtements", subfamily: "Body" },
  "bodywarmer": { family: "Vêtements", subfamily: "Bodywarmer" },
  "boxer": { family: "Sous-vêtements", subfamily: "Boxers / Caleçons" },
  "brassiere": { family: "Sous-vêtements", subfamily: "Brassières" },
  "ceinture": { family: "Accessoires Vêtements", subfamily: "Ceintures" },
  "chapeau": { family: "Headwear & Accessoires", subfamily: "Chapeaux & accessoires" },
  "chemise": { family: "Vêtements", subfamily: "Chemises / Surchemises" },
  "chemisier": { family: "Vêtements", subfamily: "Chemisiers / Blouses" },
  "combinaison": { family: "Vêtements", subfamily: "Combinaisons" },
  "cravate": { family: "Accessoires Vêtements", subfamily: "Cravates" },
  "debardeur": { family: "Vêtements", subfamily: "Débardeurs" },
  "echarpe": { family: "Headwear & Accessoires", subfamily: "Écharpes / Étoles / Tours de cou" },
  "foulard": { family: "Accessoires Vêtements", subfamily: "Foulards" },
  "gants": { family: "Headwear & Accessoires", subfamily: "Gants" },
  "gilet": { family: "Vêtements", subfamily: "Gilets" },
  "jeans": { family: "Vêtements", subfamily: "Jeans" },
  "jupe": { family: "Vêtements", subfamily: "Jupes" },
  "lunettes": { family: "Accessoires", subfamily: "Lunettes & housses" },
  "maillot-corps": { family: "Sous-vêtements", subfamily: "Maillots de Corps" },
  "maillot-sport": { family: "Vêtements", subfamily: "Maillots de sport" },
  "maillot-bain": { family: "Vêtements", subfamily: "Maillots de bain" },
  "pantalon": { family: "Vêtements", subfamily: "Pantalons / Pantacourts" },
  "parapluie": { family: "Accessoires", subfamily: "Parapluies" },
  "peluche": { family: "Peluches", subfamily: "Peluche" },
  "pullover": { family: "Vêtements", subfamily: "Pullovers / Cardigans" },
  "pyjama": { family: "Pyjamas", subfamily: "Pyjamas" },
  "robe": { family: "Vêtements", subfamily: "Robes" },
  "sac": { family: "Bagagerie", subfamily: "Sacs" },
  "salopette": { family: "Vêtements", subfamily: "Salopettes" },
  "shorty": { family: "Sous-vêtements", subfamily: "Shortys" },
  "slip": { family: "Sous-vêtements", subfamily: "Slips" },
  "tablier": { family: "Vêtements", subfamily: "Tabliers" },
  "tunique": { family: "Vêtements", subfamily: "Tuniques" },
  "valise": { family: "Bagagerie", subfamily: "Valises" },
  "chaussette": { family: "Sous-vêtements", subfamily: "Chaussettes" },
  "chaussure-securite": { family: "Chaussures & Accessoires", subfamily: "Chaussures de sécurité" },
  "chaussure-travail": { family: "Chaussures & Accessoires", subfamily: "Chaussures de travail" },
  "chaussure-lifestyle": {
    family: "Chaussures & Accessoires",
    subfamily: "Chaussures Lifestyle/Loisir",
  },
  "blouse": { family: "Vêtements", subfamily: "Blouse de travail" },
  "bob": { family: "Headwear & Accessoires", subfamily: "Bobs" },
  "gourde": { family: "Drinkwear", subfamily: "Gourdes / Bouteilles" },
  "brassard": { family: "Accessoires", subfamily: "Brassards" },
  "casque": { family: "Headwear & Accessoires", subfamily: "Casque" },
  "chasuble": { family: "Vêtements", subfamily: "Chasubles" },
  "bandana": { family: "Headwear & Accessoires", subfamily: "Bandanas" },
  "bandeau": { family: "Headwear & Accessoires", subfamily: "Bandeaux" },
  "beret": { family: "Headwear & Accessoires", subfamily: "Bérets" },
  "cagoule": { family: "Headwear & Accessoires", subfamily: "Cagoules" },
  "calot": { family: "Headwear & Accessoires", subfamily: "Calots" },
  "genouillere": { family: "Accessoires Vêtements", subfamily: "Genouillères" },
  "housse": { family: "Bagagerie", subfamily: "Housses" },
  "panier": { family: "Bagagerie", subfamily: "Paniers" },
  "bretelle": { family: "Accessoires Vêtements", subfamily: "Bretelles" },
  "deco": { family: "Linge de maison", subfamily: "Déco" },
  "accessoire-bagagerie": { family: "Bagagerie", subfamily: "Accessoires Bagagerie" },
  "accessoire-boutique": { family: "Accessoires", subfamily: "Accessoires boutique" },
  "accessoire-chaussure": {
    family: "Chaussures & Accessoires",
    subfamily: "Accessoires chaussures",
  },
  "accessoire-sport": { family: "Equipements sportifs", subfamily: "Accessoires de sport" },
  "arbitrage": { family: "Equipements sportifs", subfamily: "Matériel d'Arbitrage" },
  "materiel-entrainement": {
    family: "Equipements sportifs",
    subfamily: "Matériel d'Entraînement et de Terrain",
  },
  "materiel-gonflage": { family: "Equipements sportifs", subfamily: "Matériel de Gonflage" },
  "ballon": { family: "Equipements sportifs", subfamily: "Ballons & Accessoires" },
  "bain": { family: "Linge de maison", subfamily: "Bain" },
  "table-cuisine": { family: "Linge de maison", subfamily: "Table/Cuisine" },
  "porte-gourde": { family: "Drinkwear", subfamily: "Porte-gourdes / Porte-bouteilles" },
};
// Descriptions génériques pour les produits
// Ces descriptions peuvent être personnalisées pour chaque produit
const productDescriptions = {
  "tshirt":
    "Découvrez notre vaste gamme de t-shirts de haute qualité, parfaits pour le marquage et la personnalisation.",
  "polo":
    "Nos polos haut de gamme sont parfaits pour un usage professionnel ou événementiel. Élégants et confortables.",
  "sweat":
    "Découvrez notre sélection de sweats de haute qualité, parfaits pour le marquage et la personnalisation.",
  "casquette":
    "Notre collection de casquettes offre un excellent support pour votre communication visuelle.",
  // Descriptions par défaut pour d'autres produits
  "default":
    "Découvrez notre sélection de produits personnalisables pour votre communication par l'objet.",
};

// Template pour la page de produit
const generateProductPageTemplate = (slug: string, title: string) => {
  const mapping = productsMapping[slug as keyof typeof productsMapping] || {
    family: "Divers",
    subfamily: title,
  };
  const description =
    productDescriptions[slug as keyof typeof productDescriptions] || productDescriptions.default;

  const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1);

  return `
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue ${formattedTitle}s | Lyon Marquage Service",
  description: "Découvrez notre sélection de ${title.toLowerCase()}s personnalisables pour votre communication",
};

export default function ${formattedTitle.replace(/[\W-]/g, "")}Page() {
  return (
    <ProductCategoryDisplay
      title="${formattedTitle}s personnalisables"
      description="${description}"
      family="${mapping.family}"
      subfamily="${mapping.subfamily}"
    />
  );
}
`;
};

// Template pour la page de marque
const generateBrandPageTemplate = (slug: string, title: any) => {
  return `
export const metadata = {
  title: "${title} | Lyon Marquage Service",
  description: "Découvrez notre sélection de vêtements ${title}, reconnus pour leur qualité et leur durabilité",
};

export default function ${slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, "")}Page() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">${title}</h1>
      <p className="mb-8 text-gray-700">
        Découvrez notre collection de vêtements ${title}, reconnus pour leur qualité et leur durabilité.
      </p>
      
      {/* Add your brand-specific content here */}
    </>
  );
}
`;
};

// Gestion des chemins imbriqués comme bermuda/short
const processNestedPath = (href: string) => {
  const segments = href.split("/").filter((segment: string) => segment !== "");
  // On ignore le premier segment qui est "catalogue" ou "marques"
  return segments.slice(1);
};

// Fonction pour créer les répertoires et fichiers nécessaires
const createDirectoryAndFile = (
  dirPath: fs.PathLike,
  filePath: fs.PathOrFileDescriptor,
  content: string | NodeJS.ArrayBufferView<ArrayBufferLike>
) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(filePath, content);
  console.log(`Fichier créé: ${filePath}`);
};

// Fonction principale
const generatePages = () => {
  console.log("Génération des pages du catalogue...");

  // Suivi des chemins déjà traités pour éviter les doublons
  const processedPaths = new Set();

  // Créer les pages de produits
  const productsCategory = menuCatalogue.find(
    (cat: { category: string }) => cat.category === "Produits"
  );
  if (productsCategory && productsCategory.items) {
    productsCategory.items.forEach((item: { href: string; title: string }) => {
      // Ignore les doublons
      if (processedPaths.has(item.href)) {
        console.log(`Chemin déjà traité, ignoré: ${item.href}`);
        return;
      }

      processedPaths.add(item.href);

      // Gestion des chemins simples ou imbriqués
      const pathSegments = processNestedPath(item.href);

      if (pathSegments.length === 0) {
        console.log(`Chemin invalide pour ${item.title}: ${item.href}`);
        return;
      }

      // Pour les chemins simples, pathSegments aura une longueur de 1
      // Pour les chemins imbriqués, comme bermuda/short, pathSegments aura une longueur > 1

      let baseDir = path.join(process.cwd(), "src", "app", "catalogue");
      let currentPath = baseDir;

      // Construire le chemin complet pour les dossiers imbriqués
      for (let i = 0; i < pathSegments.length - 1; i++) {
        currentPath = path.join(currentPath, pathSegments[i]);
        if (!fs.existsSync(currentPath)) {
          fs.mkdirSync(currentPath, { recursive: true });
        }
      }

      // Le dernier segment est utilisé pour le dossier final et le fichier page.tsx
      const finalSegment = pathSegments[pathSegments.length - 1];
      const finalDir = path.join(currentPath, finalSegment);
      const filePath = path.join(finalDir, "page.tsx");

      // Slug à utiliser pour les mappings (utilisez le chemin complet pour les chemins imbriqués)
      const slug = pathSegments.join("/");

      const content = generateProductPageTemplate(slug, item.title);
      createDirectoryAndFile(finalDir, filePath, content);
    });
  }

  // Réinitialiser les chemins traités pour les marques
  processedPaths.clear();

  // Créer les pages de marques
  const brandsCategory = menuCatalogue.find(
    (cat: { category: string }) => cat.category === "Marques"
  );
  if (brandsCategory && brandsCategory.items) {
    brandsCategory.items.forEach((item: { href: string; title: any }) => {
      // Ignore les doublons
      if (processedPaths.has(item.href)) {
        console.log(`Chemin déjà traité, ignoré: ${item.href}`);
        return;
      }

      processedPaths.add(item.href);

      const pathSegments = processNestedPath(item.href);

      if (pathSegments.length === 0) {
        console.log(`Chemin invalide pour ${item.title}: ${item.href}`);
        return;
      }

      const slug = pathSegments[0]; // Pour les marques, on s'attend à un seul segment
      const dirPath = path.join(process.cwd(), "src", "app", "marques", slug);
      const filePath = path.join(dirPath, "page.tsx");

      const content = generateBrandPageTemplate(slug, item.title);
      createDirectoryAndFile(dirPath, filePath, content);
    });
  }

  console.log("Génération terminée !");
};

// Exécuter la fonction principale
generatePages();
