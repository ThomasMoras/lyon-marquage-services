
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Tuniques | Lyon Marquage Service",
  description: "Découvrez notre sélection de tuniques personnalisables pour votre communication",
};

export default function TuniquePage() {
  return (
    <ProductCategoryDisplay
      title="Tuniques personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Tunique"
    />
  );
}
