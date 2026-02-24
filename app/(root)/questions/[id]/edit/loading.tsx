import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main>
      {/* Title input */}
      <Skeleton className="h-14 w-full rounded-lg" />
      {/* Editor */}
      <Skeleton className="mt-6 h-[350px] w-full rounded-lg" />
      {/* Tags input */}
      <Skeleton className="mt-6 h-14 w-full rounded-lg" />
      {/* Submit button */}
      <Skeleton className="mt-6 h-12 w-40 rounded-lg" />
    </main>
  );
}
