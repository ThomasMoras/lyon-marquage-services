
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Calots | Lyon Marquage Service",
  description: "Découvrez notre sélection de calots personnalisables pour votre communication",
};

export default function CalotPage() {
  return (
    <ProductCategoryDisplay
      title="Calots personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Calot"
    />
  );
}
