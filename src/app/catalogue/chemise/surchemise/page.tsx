import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Chemise/Surchemises | Lyon Marquage Service",
  description:
    "Découvrez notre sélection de chemise/surchemises personnalisables pour votre communication",
};

export default function ChemiseSurchemisePage() {
  return (
    <ProductCategoryDisplay
      title="Chemise/Surchemises personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Chemise/Surchemise"
    />
  );
}
