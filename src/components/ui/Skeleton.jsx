import { cn } from "../../utils/cn";

export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-xl bg-[#222222]", className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111111]">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:auto-rows-fr lg:grid-cols-4 lg:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn(i === 0 && "col-span-2 sm:col-span-1 lg:col-span-2 lg:row-span-2")}>
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Skeleton className="h-80 w-full rounded-3xl" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

export function OrderRowSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-line bg-surface-50 p-4 shadow-card">
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-8 w-20 rounded-full" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
