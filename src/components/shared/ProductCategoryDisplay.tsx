import { Suspense } from "react";
import TopTexProductList from "@/components/shared/top_tex/TopTexProductList";

interface ProductCategoryDisplayProps {
  title: string;
  description?: string;
  family: string;
  subfamily: string;
}

export default function ProductCategoryDisplay({
  title,
  description,
  family,
  subfamily,
}: ProductCategoryDisplayProps) {
  const formattedTitle = title?.charAt(0)?.toUpperCase() + title?.slice(1) || "";

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">{formattedTitle}</h1>

      {description && (
        <p className="mb-8 text-gray-700">
          {description}
          Disponibles en plusieurs couleurs et tailles pour répondre à tous vos besoins.
        </p>
      )}

      <Suspense fallback={<div>Chargement du catalogue...</div>}>
        <TopTexProductList
          family={family}
          subfamily={subfamily}
          pageSize={12}
          title={`${formattedTitle} - Collection complète`}
        />
      </Suspense>
    </>
  );
}
