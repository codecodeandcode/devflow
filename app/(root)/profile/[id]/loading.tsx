import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      {/* Profile header */}
      <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row sm:w-full">
          <Skeleton className="size-35 rounded-full" />
          <div className="mt-3 flex flex-col gap-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-32" />
            <div className="mt-5 flex flex-wrap items-center gap-5">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-28" />
            </div>
            <Skeleton className="mt-4 h-4 w-72" />
          </div>
          <div className="flex justify-end max-sm:mb-5 lg:ml-auto max-sm:w-full sm:mt-3">
            <Skeleton className="h-12 w-44 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="mt-10">
        <Skeleton className="h-7 w-20 mb-5" />
        <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-28 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Tabs */}
      <section className="mt-10 flex gap-10">
        <div className="flex-2">
          <div className="flex gap-2">
            <Skeleton className="h-10.5 w-24 rounded-lg" />
            <Skeleton className="h-10.5 w-24 rounded-lg" />
          </div>
          <div className="mt-5 flex w-full flex-col gap-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} className="h-48 w-full rounded-[10px]" />
            ))}
          </div>
        </div>

        {/* Tags sidebar */}
        <div className="flex w-full min-w-62.5 flex-1 flex-col max-[55rem]:hidden">
          <Skeleton className="h-7 w-20" />
          <div className="mt-7 flex flex-col gap-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} className="h-10 w-full rounded-md" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
