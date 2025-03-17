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
  "casquette": { family: "Accessoires", subfamily: "Casquette" },
  "bonnet": { family: "Accessoires", subfamily: "Bonnet" },
  "veste": { family: "Vêtements", subfamily: "Veste" },
  // Ajouter d'autres mappings selon vos besoins
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
import { Suspense } from "react";

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
