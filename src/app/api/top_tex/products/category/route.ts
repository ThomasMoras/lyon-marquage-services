// app/api/top_tex/products/category/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTopTexClient } from "../../client";
import { z } from "zod";

// Schéma de validation pour les paramètres de requête
const querySchema = z.object({
  family: z.string().min(1, "La famille est requise"),
  subfamily: z.string().min(1, "La sous-famille est requise"),
  usage_right: z.string().optional().default("b2b_b2c"),
  page_number: z.coerce.number().int().min(1).optional().default(1),
  page_size: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export async function GET(request: NextRequest) {
  try {
    // Récupérer l'URL et extraire les paramètres
    const { searchParams } = new URL(request.url);
    const family = searchParams.get("family");
    const subfamily = searchParams.get("subfamily");
    const usageRight = searchParams.get("usage_right") || "b2b_b2c";
    const pageNumber = searchParams.get("page_number") || "1";
    const pageSize = searchParams.get("page_size") || "10";

    // Valider les paramètres
    const validatedParams = querySchema.parse({
      family,
      subfamily,
      usage_right: usageRight,
      page_number: pageNumber,
      page_size: pageSize,
    });

    // Initialiser le client (nous supposons que vous avez déjà configuré les credentials dans les variables d'env)
    const topTexClient = getTopTexClient();

    try {
      // Authentifier avec des credentials stockés
      await topTexClient.authenticate(
        process.env.TOP_TEX_USERNAME || "",
        process.env.TOP_TEX_PASSWORD || ""
      );

      // Récupérer les produits avec pagination
      const products = await topTexClient.getProductsByCategory({
        family: validatedParams.family,
        subfamily: validatedParams.subfamily,
        usageRight: validatedParams.usage_right,
        pageNumber: validatedParams.page_number,
        pageSize: validatedParams.page_size,
      });

      // Log de debug pour identifier les problèmes potentiels
      console.log("Réponse de l'API TopTex formatée:", {
        itemsCount: products.items?.length,
        total: products.total,
        page: products.page,
        pageSize: products.pageSize,
        totalPages: products.totalPages,
      });

      // Retourner les produits avec les informations de pagination
      return NextResponse.json({
        success: true,
        ...products,
      });
    } catch (authError) {
      console.error("Erreur d'authentification TopTex:", authError);
      return NextResponse.json(
        { success: false, message: "Échec d'authentification à l'API TopTex" },
        { status: 401 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }

    console.error("Erreur lors de la récupération des produits par catégorie:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des produits par catégorie" },
      { status: 500 }
    );
  }
}
