
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Casquettes | Lyon Marquage Service",
  description: "Découvrez notre sélection de casquettes personnalisables pour votre communication",
};

export default function CasquettePage() {
  return (
    <ProductCategoryDisplay
      title="Casquettes personnalisables"
      description="Notre collection de casquettes offre un excellent support pour votre communication visuelle."
      family="Headwear & Accessoires"
      subfamily="Casquette"
    />
  );
}
