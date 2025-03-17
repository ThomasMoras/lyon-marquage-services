
import ProductCategoryDisplay from "@/components/shared/ProductCategoryDisplay";

export const metadata = {
  title: "Catalogue Chapeau et accessoiress | Lyon Marquage Service",
  description: "Découvrez notre sélection de chapeau et accessoiress personnalisables pour votre communication",
};

export default function ChapeauetaccessoiresPage() {
  return (
    <ProductCategoryDisplay
      title="Chapeau et accessoiress personnalisables"
      description="Découvrez notre sélection de produits personnalisables pour votre communication par l'objet."
      family="Divers"
      subfamily="Chapeau et accessoires"
    />
  );
}
