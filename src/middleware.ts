import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // 1. Redirection pour les URLs avec/sans slash final
  // Par exemple, ajouter un slash final à toutes les URLs qui n'en ont pas
  const shouldAddTrailingSlash =
    !pathname.endsWith("/") && !pathname.includes(".") && pathname !== "";

  if (shouldAddTrailingSlash) {
    url.pathname = `${pathname}/`;
    return NextResponse.redirect(url, { status: 301 }); // Redirection permanente
  }

  // 2. Normalisation des casse (minuscules)
  if (pathname !== pathname.toLowerCase()) {
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, { status: 301 }); // Redirection permanente
  }

  // 3. Liste des redirections spécifiques pour les URLs alternatives
  const redirects: Record<string, string> = {
    "/serigraphie/": "/prestations/serigraphie/",
    "/flocage-textile/": "/prestations/flocage/",
    "/marquage-publicitaire/": "/objets-publicitaires/",
    "/personnalisation-tshirt/": "/imprimerie/",
    // Ajoutez d'autres redirections si nécessaire
  };

  if (redirects[pathname]) {
    url.pathname = redirects[pathname];
    return NextResponse.redirect(url, { status: 301 });
  }

  // Créer une réponse pour passer à la prochaine étape
  const response = NextResponse.next();

  // Ajouter le pathname canonique dans les headers pour le layout
  response.headers.set("x-pathname", pathname);

  // Empêcher l'indexation des URLs avec paramètres de requête (facultatif)
  if (url.search && url.search !== "") {
    response.headers.set("X-Robots-Tag", "noindex, follow");
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
