
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Gilets | Lyon Marquage Service",
  description: "Découvrez notre sélection de gilets personnalisables pour votre communication",
};

export default function GiletPage() {
  return (
    <ProductCategoryDisplay
      title="Gilets personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Vêtements"
      subfamily="Gilets"
    />
  );
}
