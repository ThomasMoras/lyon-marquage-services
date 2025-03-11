// app/api/top_tex/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTopTexClient } from "../client";
import { z } from "zod";

const authSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export async function POST(request: NextRequest) {
  try {
    // Récupérer et valider les données
    const body = await request.json();
    const validatedData = authSchema.parse(body);

    // Initialiser le client et s'authentifier
    const topTexClient = getTopTexClient();
    const token = await topTexClient.authenticate(validatedData.username, validatedData.password);

    return NextResponse.json({ success: true, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }

    console.error("Erreur d'authentification TopTex:", error);
    return NextResponse.json(
      { success: false, message: "Erreur d'authentification" },
      { status: 500 }
    );
  }
}
