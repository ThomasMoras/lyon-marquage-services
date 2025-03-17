
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Bonnets | Lyon Marquage Service",
  description: "Découvrez notre sélection de bonnets personnalisables pour votre communication",
};

export default function BonnetPage() {
  return (
    <ProductCategoryDisplay
      title="Bonnets personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Headwear & Accessoires"
      subfamily="Bonnet"
    />
  );
}
