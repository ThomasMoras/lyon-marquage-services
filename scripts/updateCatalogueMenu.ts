// Utiliser CommonJS require au lieu de import
const fs = require("fs");
const path = require("path");
// Utiliser axios au lieu de node-fetch
const axios = require("axios");
const dotenv = require("dotenv");

// Charger les variables d'environnement
dotenv.config();

// Vérifiez que la clé API existe, sinon lancez une erreur
const TOP_TEX_API_KEY = process.env.TOP_TEX_API_KEY;
if (!TOP_TEX_API_KEY) {
  throw new Error("TOP_TEX_API_KEY is not defined in environment variables");
}

const TOP_TEX_URL = process.env.TOP_TEX_URL || "https://api.toptex.io";

/**
 * Récupère les catégories depuis l'API TOP_TEX
 */
async function fetchTopTexCategories() {
  const username = process.env.TOP_TEX_USERNAME;
  const password = process.env.TOP_TEX_PASSWORD;

  if (!username || !password) {
    throw new Error("TOP_TEX_USERNAME or TOP_TEX_PASSWORD is not defined in environment variables");
  }

  // Utiliser axios au lieu de fetch
  const authResponse = await axios.post(
    `${TOP_TEX_URL}/v3/authenticate`,
    {
      username,
      password,
    },
    {
      headers: {
        "x-api-key": TOP_TEX_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  const token = authResponse.data.token;

  // Récupération des attributs
  const attributesResponse = await axios.get(
    `${TOP_TEX_URL}/v3/attributes?attributes=brand,family,subfamily`,
    {
      headers: {
        "x-api-key": TOP_TEX_API_KEY,
        "x-toptex-authorization": token,
      },
    }
  );

  return attributesResponse.data;
}

/**
 * Génère le fichier catalogue.ts
 */
async function generateCatalogueFile() {
  const data = await fetchTopTexCategories();

  // Extraction des marques (uniquement celles qui vous intéressent)
  const brands = data.items[0].brand.filter((brand: string) =>
    ["Kariban", "Russell", "Fruit of the Loom", "Beechfield", "Gildan", "B&C"].includes(brand)
  );

  // Extraction des sous-familles en français
  const subfamilies = data.items[2].subfamily
    .filter(
      (sf: { family_fr: string }) =>
        sf.family_fr === "Vêtements" || sf.family_fr === "Headwear & Accessoires"
    )
    .map((sf: { fr: string }) => ({
      title: sf.fr,
      href: `/catalogue/${sf.fr
        .toLowerCase()
        .replace(/\s+/g, "-")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")}`,
    }));

  // Créer la structure du menu
  const menuContent = `
import { CatalogueItem } from "@/types/commonTypes";

export const menuCatalogue: CatalogueItem[] = [
  {
    category: "Produits",
    items: [
      ${subfamilies
        .map((sf: { title: any; href: any }) => `{ title: "${sf.title}", href: "${sf.href}" }`)
        .join(",\n      ")}
    ],
  },
  {
    category: "Marques",
    items: [
      ${brands
        .map((brand: string) => {
          const href = `/marques/${brand.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "")}`;
          return `{ title: "${brand}", href: "${href}" }`;
        })
        .join(",\n      ")}
    ],
  },
];
`;

  // Écrire le fichier
  fs.writeFileSync(path.join(process.cwd(), "src/constants/catalogue.ts"), menuContent);

  console.log("Menu catalogue mis à jour avec succès!");
}

// Exécuter le script
generateCatalogueFile().catch(console.error);
