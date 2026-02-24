import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <Skeleton className="h-12 w-24" />

      <section className="mt-11 sm:flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Skeleton className="h-14 flex-1" />
        <Skeleton className="h-14 w-28" />
      </section>

      {/* Tag cards */}
      <div className="mt-10 flex flex-wrap gap-4 w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <Skeleton
            key={item}
            className="h-[160px] w-full rounded-2xl xs:w-[230px]"
          />
        ))}
      </div>
    </>
  );
}
