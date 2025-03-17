
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Bodywarmers | Lyon Marquage Service",
  description: "Découvrez notre sélection de bodywarmers personnalisables pour votre communication",
};

export default function BodywarmerPage() {
  return (
    <ProductCategoryDisplay
      title="Bodywarmers personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Vêtements"
      subfamily="Bodywarmer"
    />
  );
}
