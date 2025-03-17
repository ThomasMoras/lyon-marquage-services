
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Jupes | Lyon Marquage Service",
  description: "Découvrez notre sélection de jupes personnalisables pour votre communication",
};

export default function JupePage() {
  return (
    <ProductCategoryDisplay
      title="Jupes personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Jupe"
    />
  );
}
