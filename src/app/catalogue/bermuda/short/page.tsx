
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Bermuda/Shorts | Lyon Marquage Service",
  description: "Découvrez notre sélection de bermuda/shorts personnalisables pour votre communication",
};

export default function BermudaShortPage() {
  return (
    <ProductCategoryDisplay
      title="Bermuda/Shorts personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Bermuda/Short"
    />
  );
}
