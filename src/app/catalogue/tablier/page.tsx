
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Tabliers | Lyon Marquage Service",
  description: "Découvrez notre sélection de tabliers personnalisables pour votre communication",
};

export default function TablierPage() {
  return (
    <ProductCategoryDisplay
      title="Tabliers personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Vêtements"
      subfamily="Tabliers"
    />
  );
}
