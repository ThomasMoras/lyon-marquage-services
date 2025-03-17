
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Casques | Lyon Marquage Service",
  description: "Découvrez notre sélection de casques personnalisables pour votre communication",
};

export default function CasquePage() {
  return (
    <ProductCategoryDisplay
      title="Casques personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Casque"
    />
  );
}
