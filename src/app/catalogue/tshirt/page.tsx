
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue TShirts | Lyon Marquage Service",
  description: "Découvrez notre sélection de tshirts personnalisables pour votre communication",
};

export default function TShirtPage() {
  return (
    <ProductCategoryDisplay
      title="TShirts personnalisables"
      description="Découvrez notre vaste gamme de t-shirts de haute qualité, parfaits pour le marquage et la personnalisation."
      family="Vêtements"
      subfamily="T-shirt"
    />
  );
}
