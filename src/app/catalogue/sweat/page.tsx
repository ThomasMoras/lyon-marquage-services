
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Sweats | Lyon Marquage Service",
  description: "Découvrez notre sélection de sweats personnalisables pour votre communication",
};

export default function SweatPage() {
  return (
    <ProductCategoryDisplay
      title="Sweats personnalisables"
      description="Découvrez notre sélection de sweats de haute qualité, parfaits pour le marquage et la personnalisation."
      family="Vêtements"
      subfamily="Sweat"
    />
  );
}
