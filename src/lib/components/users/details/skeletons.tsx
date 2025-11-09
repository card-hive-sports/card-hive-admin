import {Skeleton, SkeletonCircle, SkeletonText} from "../../ui/skeleton";

export const AccountInfoSkeleton = () => (
  <div className="glass p-6 rounded-2xl space-y-5">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-5 w-20" />
    </div>
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={`info-row-${index}`} className="flex items-center gap-3">
        <SkeletonCircle className="w-10 h-10" />
        <div className="flex-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
      </div>
    ))}
    <div className="border-t border-white/10 pt-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  </div>
);

export const AccountMetricsSkeleton = () => (
  <div className="glass p-6 rounded-2xl">
    <Skeleton className="h-5 w-32 mb-6" />
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={`stat-${index}`} className="bg-black/30 p-4 rounded-lg space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  </div>
);

export const LoginMethodsSkeleton = () => (
  <div className="glass p-6 rounded-2xl space-y-4">
    <Skeleton className="h-5 w-48" />
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={`provider-chip-${index}`} className="h-7 w-20 rounded-full" />
      ))}
    </div>
    <div className="border-t border-white/10 pt-4 space-y-2">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-4 w-28" />
    </div>
  </div>
);

export const LoginActivitySkeleton = () => (
  <div className="glass p-6 rounded-2xl space-y-3">
    <Skeleton className="h-5 w-40" />
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={`login-${index}`} className="p-4 bg-black/30 rounded-lg">
        <Skeleton className="h-4 w-40 mb-2" />
        <SkeletonText lines={2} />
      </div>
    ))}
  </div>
);

export const UserDetailSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AccountInfoSkeleton />
      <AccountMetricsSkeleton />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <LoginMethodsSkeleton />
      <LoginActivitySkeleton />
    </div>
  </div>
);
