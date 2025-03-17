
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Jeans | Lyon Marquage Service",
  description: "Découvrez notre sélection de jeans personnalisables pour votre communication",
};

export default function JeanPage() {
  return (
    <ProductCategoryDisplay
      title="Jeans personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Jean"
    />
  );
}
