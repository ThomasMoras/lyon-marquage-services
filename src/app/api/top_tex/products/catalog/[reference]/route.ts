// app/api/top_tex/products/catalog/[reference]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTopTexClient } from "../../../client";

export async function GET(request: NextRequest, { params }: { params: { reference: string } }) {
  try {
    const catalogReference = params.reference;

    if (!catalogReference) {
      return NextResponse.json(
        { success: false, message: "Référence catalogue manquante" },
        { status: 400 }
      );
    }

    // Récupérer les paramètres de requête optionnels
    const searchParams = request.nextUrl.searchParams;
    const usageRight = searchParams.get("usage_right") || "b2b_uniquement";
    const lang = searchParams.get("lang");
    const color = searchParams.get("color");

    console.log(`Récupération du produit avec la référence catalogue ${catalogReference}`);
    console.log(`Paramètres: usage_right=${usageRight}, lang=${lang}, color=${color}`);

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

    // Initialiser le client TopTex
    const topTexClient = getTopTexClient();

    try {
      // Récupérer le produit par sa référence catalogue
      const options: any = { usageRight };
      if (lang) options.lang = lang.split(",");
      if (color) options.color = color;

      const product = await topTexClient.getProductByCatalogReference(catalogReference, options);

      if (!product) {
        console.warn(`Produit non trouvé pour la référence catalogue ${catalogReference}`);
        return NextResponse.json(
          { success: false, message: "Produit non trouvé" },
          { status: 404 }
        );
      }

      console.log(`Produit récupéré avec succès: ${product.catalogReference}`);

      // Récupérer les produits associés (autres produits avec la même référence catalogue mais des couleurs différentes)
      let relatedProducts: any[] = [];

      if (product.colors && product.colors.length > 0) {
        // TODO: Implémenter la récupération des produits associés si nécessaire
      }

      return NextResponse.json({
        success: true,
        product,
        relatedProducts,
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
