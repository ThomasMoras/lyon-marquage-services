
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Robes | Lyon Marquage Service",
  description: "Découvrez notre sélection de robes personnalisables pour votre communication",
};

export default function RobePage() {
  return (
    <ProductCategoryDisplay
      title="Robes personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Robe"
    />
  );
}
