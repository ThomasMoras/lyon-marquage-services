
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Combinaisons | Lyon Marquage Service",
  description: "Découvrez notre sélection de combinaisons personnalisables pour votre communication",
};

export default function CombinaisonPage() {
  return (
    <ProductCategoryDisplay
      title="Combinaisons personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Vêtements"
      subfamily="Combinaisons"
    />
  );
}
