
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Ponchos | Lyon Marquage Service",
  description: "Découvrez notre sélection de ponchos personnalisables pour votre communication",
};

export default function PonchoPage() {
  return (
    <ProductCategoryDisplay
      title="Ponchos personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Poncho"
    />
  );
}
