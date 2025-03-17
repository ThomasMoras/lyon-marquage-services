
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Écharpe / Étole / Tour de cous | Lyon Marquage Service",
  description: "Découvrez notre sélection de écharpe / étole / tour de cous personnalisables pour votre communication",
};

export default function charpetoleTourdecouPage() {
  return (
    <ProductCategoryDisplay
      title="Écharpe / Étole / Tour de cous personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Écharpe / Étole / Tour de cou"
    />
  );
}
