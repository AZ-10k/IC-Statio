import { Skeleton } from "@/components/ui/skeleton";

const ProductSkeleton = () => {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-card">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 lg:p-5 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
};

export default ProductSkeleton;
