
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Maillot de sports | Lyon Marquage Service",
  description: "Découvrez notre sélection de maillot de sports personnalisables pour votre communication",
};

export default function MaillotdesportPage() {
  return (
    <ProductCategoryDisplay
      title="Maillot de sports personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Maillot de sport"
    />
  );
}
