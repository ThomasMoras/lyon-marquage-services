
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Pantalon/Pantacourts | Lyon Marquage Service",
  description: "Découvrez notre sélection de pantalon/pantacourts personnalisables pour votre communication",
};

export default function PantalonPantacourtPage() {
  return (
    <ProductCategoryDisplay
      title="Pantalon/Pantacourts personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Pantalon/Pantacourt"
    />
  );
}
