import { cn } from '@/utils';

interface ProductCardSkeletonProps {
  className?: string;
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div className={cn('card overflow-hidden', className)}>
      {/* Image Skeleton */}
      <div className="aspect-square skeleton" />

      {/* Content Skeleton */}
      <div className="p-4">
        {/* Brand */}
        <div className="mb-2 h-3 w-16 skeleton" />

        {/* Title */}
        <div className="mb-2 h-4 w-full skeleton" />
        <div className="mb-3 h-4 w-3/4 skeleton" />

        {/* Rating */}
        <div className="mb-3 h-4 w-24 skeleton" />

        {/* Price */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-20 skeleton" />
          <div className="h-4 w-16 skeleton" />
        </div>
      </div>
    </div>
  );
}

interface ProductGridSkeletonProps {
  count?: number;
  className?: string;
}

export function ProductGridSkeleton({
  count = 8,
  className,
}: ProductGridSkeletonProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4',
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
