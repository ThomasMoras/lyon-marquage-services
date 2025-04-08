// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Ne pas créer de redirections automatiques pour l'instant
  // Juste passer les en-têtes

  // Créer une réponse pour passer à la prochaine étape
  const response = NextResponse.next();

  // Ajouter le pathname dans les headers pour le layout
  response.headers.set("x-pathname", request.nextUrl.pathname);

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
