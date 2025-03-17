
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Cagoules | Lyon Marquage Service",
  description: "Découvrez notre sélection de cagoules personnalisables pour votre communication",
};

export default function CagoulePage() {
  return (
    <ProductCategoryDisplay
      title="Cagoules personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Cagoule"
    />
  );
}
