import { NextRequest, NextResponse } from "next/server";
import { getTopTexClient } from "../../client";

export async function GET(request: NextRequest, { params }: { params: { sku: string } }) {
  try {
    const sku = params.sku;

    if (!sku) {
      return NextResponse.json({ success: false, message: "SKU manquant" }, { status: 400 });
    }

    // Vérifier les variables d'environnement requises
    const username = process.env.TOP_TEX_USERNAME;
    const password = process.env.TOP_TEX_PASSWORD;
    const apiKey = process.env.TOP_TEX_API_KEY;

    if (!username || !password || !apiKey) {
      console.error("Variables d'environnement manquantes:", {
        username: !!username,
        password: !!password,
        apiKey: !!apiKey,
      });
      return NextResponse.json(
        { success: false, message: "Configuration API incomplète" },
        { status: 500 }
      );
    }

    console.log(`Récupération du produit ${sku}...`);

    // Extraire la référence catalogue
    const hasUnderscores = sku.includes("_");
    const catalogReference = hasUnderscores ? sku.split("_")[0] : sku;

    // Initialiser le client TopTex
    const topTexClient = getTopTexClient();

    try {
      // Rechercher le produit et récupérer également d'autres produits liés
      const result = await fetchProductWithRelated(topTexClient, sku, catalogReference);

      if (!result.product) {
        console.warn(`Produit non trouvé: ${sku}`);
        return NextResponse.json(
          { success: false, message: "Produit non trouvé" },
          { status: 404 }
        );
      }

      console.log(`Produit récupéré avec succès: ${result.product.sku || sku}`);

      return NextResponse.json({
        success: true,
        product: result.product,
        relatedProducts: result.relatedProducts || [],
        exactMatch: result.exactMatch,
      });
    } catch (apiError) {
      console.error("Erreur API TopTex:", apiError);
      const errorMessage = apiError instanceof Error ? apiError.message : "Erreur inconnue";

      return NextResponse.json(
        {
          success: false,
          message: `Erreur lors de l'appel à l'API: ${errorMessage}`,
          error: errorMessage,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erreur serveur:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";

    return NextResponse.json(
      {
        success: false,
        message: `Erreur serveur: ${errorMessage}`,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

// Fonction pour récupérer un produit avec des produits associés
async function fetchProductWithRelated(topTexClient: any, sku: string, catalogReference: string) {
  // S'assurer d'avoir un token valide
  await topTexClient.ensureAuthenticated();

  // Valeur par défaut pour usage_right
  const usageRight = "b2b_uniquement";

  // Résultat par défaut
  const result = {
    product: null,
    relatedProducts: [],
    exactMatch: false,
  };

  // Rechercher par référence catalogue pour obtenir tous les produits associés
  try {
    const url = new URL(`${topTexClient.baseUrl}/v3/products`);
    url.searchParams.append("usage_right", usageRight);
    url.searchParams.append("catalog_reference", catalogReference);

    console.log(`Recherche par référence catalogue: ${catalogReference}`);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: topTexClient.getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erreur API (${response.status}):`, errorText);
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    let products = [];

    // Extraire les produits selon le format de réponse
    if (Array.isArray(data)) {
      products = data;
    } else if (data && Array.isArray(data.items)) {
      products = data.items;
    } else if (data) {
      // Parcourir les propriétés numériques
      for (const key in data) {
        if (!isNaN(Number(key)) && typeof data[key] === "object") {
          products.push(data[key]);
        }
      }
    }

    console.log(`Trouvé ${products.length} produits pour la référence ${catalogReference}`);

    if (products.length === 0) {
      return result;
    }

    // Traiter tous les produits
    const processedProducts = products.map((p: any) => topTexClient.processProductData(p));

    // Chercher le produit exact par SKU
    const exactMatch = sku.includes("_") ? processedProducts.find((p: any) => p.sku === sku) : null;

    if (exactMatch) {
      console.log(`Correspondance exacte trouvée pour le SKU ${sku}`);
      result.product = exactMatch;
      result.relatedProducts = processedProducts.filter((p: any) => p.sku !== sku);
      result.exactMatch = true;
    } else {
      // Si pas de correspondance exacte, prendre le premier produit
      result.product = processedProducts[0];
      result.relatedProducts = processedProducts.slice(1);
      result.exactMatch = false;
    }

    return result;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits associés:", error);
    throw error;
  }
}
