// app/catalogue/vetements/sweat/page.tsx
import TopTexProductList from "@/components/shared/top_tex/TopTexProductList";
import { Suspense } from "react";

export const metadata = {
  title: "Catalogue Sweats | Lyon Marquage Service",
  description: "Découvrez notre sélection de sweats personnalisables",
};

export default function SweatsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Sweats personnalisables</h1>

      <p className="mb-8 text-gray-700">
        Découvrez notre sélection de sweats de haute qualité, parfaits pour le marquage et la
        personnalisation. Disponibles en plusieurs couleurs et tailles.
      </p>

      <Suspense fallback={<div>Chargement du catalogue...</div>}>
        <TopTexProductList family="Vêtements" subfamily="Sweat" pageSize={12} />
      </Suspense>
    </div>
  );
}
