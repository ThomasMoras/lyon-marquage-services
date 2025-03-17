
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Bérets | Lyon Marquage Service",
  description: "Découvrez notre sélection de bérets personnalisables pour votre communication",
};

export default function BretPage() {
  return (
    <ProductCategoryDisplay
      title="Bérets personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Béret"
    />
  );
}
