
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Bandeaus | Lyon Marquage Service",
  description: "Découvrez notre sélection de bandeaus personnalisables pour votre communication",
};

export default function BandeauPage() {
  return (
    <ProductCategoryDisplay
      title="Bandeaus personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Headwear & Accessoires"
      subfamily="Bandeaux"
    />
  );
}
