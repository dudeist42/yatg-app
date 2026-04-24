import { Skeleton } from '@heroui/react';

export const MovieOverviewSkeleton = () => {
  return (
    <div className="mt-15 flex flex-col gap-4 max-w-4xl">
      <Skeleton className="w-28 h-8" />
      <div className="flex flex-col gap-2">
        <Skeleton className="w-2/3 h-6" />
        <Skeleton className="w-5/6 h-6" />
        <Skeleton className="w-1/2 h-6" />
      </div>
    </div>
  );
};
