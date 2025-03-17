
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Bodys | Lyon Marquage Service",
  description: "Découvrez notre sélection de bodys personnalisables pour votre communication",
};

export default function BodyPage() {
  return (
    <ProductCategoryDisplay
      title="Bodys personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Vêtements"
      subfamily="Body"
    />
  );
}
