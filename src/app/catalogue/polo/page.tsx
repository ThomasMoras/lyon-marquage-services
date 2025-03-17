
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Polos | Lyon Marquage Service",
  description: "Découvrez notre sélection de polos personnalisables pour votre communication",
};

export default function PoloPage() {
  return (
    <ProductCategoryDisplay
      title="Polos personnalisables"
      description="Nos polos haut de gamme sont parfaits pour un usage professionnel ou événementiel. Élégants et confortables."
      family="Vêtements"
      subfamily="Polo"
    />
  );
}
