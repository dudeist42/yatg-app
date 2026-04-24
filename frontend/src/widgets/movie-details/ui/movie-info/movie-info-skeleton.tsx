import { Skeleton } from '@heroui/react';

export const MovieInfoSkeleton = () => {
  return (
    <div className="flex flex-col max-sm:items-center gap-2 max-sm:gap-3">
      <Skeleton className="w-10 h-6" />
      <Skeleton className="w-lg h-17 max-sm:w-2xs max-sm:h-9" />
      <Skeleton className="w-sm h-7 max-sm:w-40 max-sm:h-6" />
    </div>
  );
};
