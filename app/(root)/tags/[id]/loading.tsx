import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <Skeleton className="h-12 w-48" />
      </section>

      <section className="mt-11">
        <Skeleton className="h-14 w-full" />
      </section>

      {/* Question cards */}
      <div className="mt-10 flex w-full flex-col gap-6">
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton key={item} className="h-48 w-full rounded-[10px]" />
        ))}
      </div>
    </>
  );
}
