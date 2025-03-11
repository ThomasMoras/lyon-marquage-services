import { NextRequest, NextResponse } from "next/server";
import { getTopTexClient } from "../../client";
import { z } from "zod";

// Schéma de validation pour les paramètres de requête
const querySchema = z.object({
  brand: z.string().min(1, "La marque est requise"),
  usage_right: z.string().optional().default("b2b_uniquement"),
});

export async function GET(request: NextRequest) {
  try {
    // Récupérer l'URL et extraire les paramètres
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get("brand");
    const usageRight = searchParams.get("usage_right") || "b2b_uniquement";

    // Valider les paramètres
    const validatedParams = querySchema.parse({
      brand,
      usage_right: usageRight,
    });

    // Récupérer le token de session (à adapter selon votre système d'authentification)
    // Remarque: Dans un cas réel, vous pourriez vouloir vérifier une session utilisateur ici

    // Initialiser le client (nous supposons que vous avez déjà configuré les credentials dans les variables d'env)
    const topTexClient = getTopTexClient();

    // Authentifier avec des credentials stockés (dans un environnement réel, utilisez un service sécurisé)
    await topTexClient.authenticate(
      process.env.TOP_TEX_USERNAME || "",
      process.env.TOP_TEX_PASSWORD || ""
    );

    // Récupérer les produits
    const products = await topTexClient.getProductsByBrand(
      validatedParams.brand,
      validatedParams.usage_right
    );

    // Retourner les produits
    return NextResponse.json({ success: true, products });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }

    console.error("Erreur lors de la récupération des produits:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des produits" },
      { status: 500 }
    );
  }
}
