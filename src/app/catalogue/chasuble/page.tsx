
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Chasubles | Lyon Marquage Service",
  description: "Découvrez notre sélection de chasubles personnalisables pour votre communication",
};

export default function ChasublePage() {
  return (
    <ProductCategoryDisplay
      title="Chasubles personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Vêtements"
      subfamily="Chasubles"
    />
  );
}
