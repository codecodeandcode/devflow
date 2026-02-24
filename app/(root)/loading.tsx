import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-11.5 w-32 rounded-lg" />
      </section>

      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="h-14 flex-1" />
        <Skeleton className="h-14 w-28" />
      </section>

      {/* HomeFilter */}
      <div className="mt-10 hidden flex-wrap gap-3 md:flex">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-9 w-24 rounded-lg" />
        ))}
      </div>

      {/* Question cards */}
      <div className="mt-10 flex w-full flex-col gap-6">
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton key={item} className="h-48 w-full rounded-[10px]" />
        ))}
      </div>
    </>
  );
}
