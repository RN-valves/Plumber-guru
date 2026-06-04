export function SkeletonBar({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className}`}
    />
  );
}

export function HomePageSkeleton() {
  return (
    <div className="space-y-16 pb-16">
      <div className="bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-950 py-20">
        <div className="container-pg space-y-6">
          <SkeletonBar className="h-4 w-32" />
          <SkeletonBar className="h-12 w-full max-w-xl" />
          <SkeletonBar className="h-12 w-full max-w-lg" />
          <SkeletonBar className="h-5 w-full max-w-md" />
          <div className="flex gap-4 pt-4">
            <SkeletonBar className="h-12 w-40" />
            <SkeletonBar className="h-12 w-40" />
          </div>
        </div>
      </div>
      <div className="container-pg grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 p-6 dark:border-gray-800 space-y-4"
          >
            <SkeletonBar className="h-10 w-10 rounded-lg" />
            <SkeletonBar className="h-6 w-3/4" />
            <SkeletonBar className="h-4 w-full" />
            <SkeletonBar className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TrainingPageSkeleton() {
  return (
    <div className="container-pg py-10 space-y-8">
      <SkeletonBar className="h-10 w-64" />
      <SkeletonBar className="h-5 w-96 max-w-full" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBar key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-4 space-y-3 dark:border-gray-800">
            <SkeletonBar className="h-40 w-full rounded-lg" />
            <SkeletonBar className="h-5 w-3/4" />
            <SkeletonBar className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function JobsPageSkeleton() {
  return (
    <div className="container-pg py-10 space-y-8">
      <SkeletonBar className="h-10 w-48" />
      <SkeletonBar className="h-10 w-full max-w-md rounded-lg" />
      <div className="flex gap-2">
        <SkeletonBar className="h-9 w-28 rounded-full" />
        <SkeletonBar className="h-9 w-28 rounded-full" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-5 space-y-3 dark:border-gray-800">
            <SkeletonBar className="h-6 w-1/2" />
            <SkeletonBar className="h-4 w-1/3" />
            <SkeletonBar className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ToolsPageSkeleton() {
  return (
    <div className="container-pg py-10 space-y-8">
      <SkeletonBar className="h-10 w-56" />
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBar key={i} className="h-10 w-32 shrink-0 rounded-lg" />
        ))}
      </div>
      <div className="rounded-2xl border p-8 space-y-4 dark:border-gray-800">
        <SkeletonBar className="h-8 w-48" />
        <SkeletonBar className="h-4 w-full" />
        <SkeletonBar className="h-4 w-full" />
        <SkeletonBar className="h-12 w-full max-w-xs" />
      </div>
    </div>
  );
}

export function GenericPageSkeleton() {
  return (
    <div className="container-pg py-10 space-y-8">
      <SkeletonBar className="h-10 w-72" />
      <SkeletonBar className="h-5 w-full max-w-2xl" />
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-6 space-y-3 dark:border-gray-800">
            <SkeletonBar className="h-8 w-8 rounded" />
            <SkeletonBar className="h-6 w-2/3" />
            <SkeletonBar className="h-4 w-full" />
            <SkeletonBar className="h-4 w-4/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="container-pg py-10 space-y-8">
      <div className="flex items-center gap-4">
        <SkeletonBar className="h-16 w-16 rounded-full" />
        <div className="space-y-2 flex-1">
          <SkeletonBar className="h-6 w-48" />
          <SkeletonBar className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBar key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <SkeletonBar className="h-64 w-full rounded-xl" />
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <SkeletonBar className="h-8 w-48" />
        <SkeletonBar className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBar key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <SkeletonBar className="h-80 rounded-xl lg:col-span-3" />
        <SkeletonBar className="h-80 rounded-xl lg:col-span-2" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <SkeletonBar className="h-96 rounded-xl" />
        <SkeletonBar className="h-96 rounded-xl" />
      </div>
      <SkeletonBar className="h-64 rounded-xl" />
    </div>
  );
}
