
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Gantss | Lyon Marquage Service",
  description: "Découvrez notre sélection de gantss personnalisables pour votre communication",
};

export default function GantsPage() {
  return (
    <ProductCategoryDisplay
      title="Gantss personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Gants"
    />
  );
}
