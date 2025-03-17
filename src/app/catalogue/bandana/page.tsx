import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Bandanas | Lyon Marquage Service",
  description: "Découvrez notre sélection de bandanas personnalisables pour votre communication",
};

export default function BandanaPage() {
  return (
    <ProductCategoryDisplay
      title="Bandanas personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Bandana"
    />
  );
}
