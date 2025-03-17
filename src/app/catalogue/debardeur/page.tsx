
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Débardeurs | Lyon Marquage Service",
  description: "Découvrez notre sélection de débardeurs personnalisables pour votre communication",
};

export default function DbardeurPage() {
  return (
    <ProductCategoryDisplay
      title="Débardeurs personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Débardeur"
    />
  );
}
