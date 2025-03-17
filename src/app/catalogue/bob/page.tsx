
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Bobs | Lyon Marquage Service",
  description: "Découvrez notre sélection de bobs personnalisables pour votre communication",
};

export default function BobPage() {
  return (
    <ProductCategoryDisplay
      title="Bobs personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Bob"
    />
  );
}
