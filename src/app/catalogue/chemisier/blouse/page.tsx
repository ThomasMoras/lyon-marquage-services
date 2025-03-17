
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Chemisier/Blouses | Lyon Marquage Service",
  description: "Découvrez notre sélection de chemisier/blouses personnalisables pour votre communication",
};

export default function ChemisierBlousePage() {
  return (
    <ProductCategoryDisplay
      title="Chemisier/Blouses personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Chemisier/Blouse"
    />
  );
}
