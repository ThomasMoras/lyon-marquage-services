
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Pullover/Cardigans | Lyon Marquage Service",
  description: "Découvrez notre sélection de pullover/cardigans personnalisables pour votre communication",
};

export default function PulloverCardiganPage() {
  return (
    <ProductCategoryDisplay
      title="Pullover/Cardigans personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Pullover/Cardigan"
    />
  );
}
