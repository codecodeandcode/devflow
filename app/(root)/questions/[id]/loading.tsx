import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between sm:flex-col">
          {/* Author info */}
          <div className="flex items-center justify-start gap-1">
            <Skeleton className="size-[22px] rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>

          {/* Votes & Save */}
          <div className="flex justify-end items-center gap-4">
            <div className="flex-center gap-2.5">
              {/* Upvote */}
              <div className="flex-center gap-1.5">
                <Skeleton className="size-[18px] rounded" />
                <Skeleton className="h-6 w-8 rounded-sm" />
              </div>
              {/* Downvote */}
              <div className="flex-center gap-1.5">
                <Skeleton className="size-[18px] rounded" />
                <Skeleton className="h-6 w-8 rounded-sm" />
              </div>
            </div>
            {/* Save icon */}
            <Skeleton className="size-[18px] rounded" />
          </div>
        </div>

        {/* Title */}
        <Skeleton className="mt-3.5 h-8 w-full max-w-[600px]" />

        {/* Metrics */}
        <div className="w-full mb-8 mt-5 flex flex-wrap gap-4 justify-start">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* Content preview */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[70%]" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>

      {/* Tags */}
      <div className="mt-8 flex flex-wrap gap-2">
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-7 w-16 rounded-md" />
        ))}
      </div>

      {/* Answers section */}
      <section className="my-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="mt-5 flex flex-col gap-6">
          {[1, 2].map((item) => (
            <div key={item} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Skeleton className="size-6 rounded-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24 ml-auto" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[85%]" />
              <Skeleton className="h-4 w-[60%]" />

              {/* Answer votes */}
              <div className="flex items-center gap-2.5 mt-2">
                <Skeleton className="size-[18px] rounded" />
                <Skeleton className="h-6 w-8 rounded-sm" />
                <Skeleton className="size-[18px] rounded" />
                <Skeleton className="h-6 w-8 rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Answer form */}
      <section className="my-5">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-[250px] w-full rounded-lg" />
        <Skeleton className="mt-4 h-12 w-36 rounded-lg" />
      </section>
    </>
  );
}
