
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Vestes | Lyon Marquage Service",
  description: "Découvrez notre sélection de vestes personnalisables pour votre communication",
};

export default function VestePage() {
  return (
    <ProductCategoryDisplay
      title="Vestes personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Vêtements"
      subfamily="Veste"
    />
  );
}
