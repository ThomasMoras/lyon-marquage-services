
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Salopettes | Lyon Marquage Service",
  description: "Découvrez notre sélection de salopettes personnalisables pour votre communication",
};

export default function SalopettePage() {
  return (
    <ProductCategoryDisplay
      title="Salopettes personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Salopette"
    />
  );
}
