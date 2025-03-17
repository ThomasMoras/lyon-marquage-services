
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Chapeau Bandanas | Lyon Marquage Service",
  description: "Découvrez notre sélection de chapeau bandanas personnalisables pour votre communication",
};

export default function ChapeauBandanaPage() {
  return (
    <ProductCategoryDisplay
      title="Chapeau Bandanas personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Chapeau Bandana"
    />
  );
}
