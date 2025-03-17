
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Blouse de travails | Lyon Marquage Service",
  description: "Découvrez notre sélection de blouse de travails personnalisables pour votre communication",
};

export default function BlousedetravailPage() {
  return (
    <ProductCategoryDisplay
      title="Blouse de travails personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Blouse de travail"
    />
  );
}
