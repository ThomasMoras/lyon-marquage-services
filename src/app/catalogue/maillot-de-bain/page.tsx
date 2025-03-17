
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Maillot de bains | Lyon Marquage Service",
  description: "Découvrez notre sélection de maillot de bains personnalisables pour votre communication",
};

export default function MaillotdebainPage() {
  return (
    <ProductCategoryDisplay
      title="Maillot de bains personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Maillot de bain"
    />
  );
}
