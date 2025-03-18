import { ProductCategorySkeleton } from "@/components/shared/skeleton/ProductCategorySkeleton";
import { TopTexProductListSkeleton } from "@/components/shared/skeleton/TopTexProductListSkeleton";

export default function Loading() {
  return (
    <div className="container mx-auto py-12">
      <ProductCategorySkeleton />
      <TopTexProductListSkeleton itemCount={12} />
    </div>
  );
}
