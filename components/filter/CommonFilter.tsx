"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import { formUrlQuery } from "@/lib/url";

interface Filter {
  name: string;
  value: string;
}

interface Props {
  filters: Filter[];
  otherClasses?: string;
  containerClass?: string;
}

export default function CommonFilter({
  filters,
  otherClasses,
  containerClass,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramFilter = searchParams.get("filter");

  function handleFilterChange(filterValue: string) {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value: filterValue,
    });

    router.push(newUrl, { scroll: false });
  }

  return (
    <div className={cn("relative max-sm:w-full", containerClass)}>
      <Select
        onValueChange={(value) => handleFilterChange(value)}
        defaultValue={paramFilter || undefined}
      >
        <SelectTrigger
          className={cn(
            "max-sm:w-full text-center body-regular no-focus light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5",
            otherClasses
          )}
          aria-label="过滤"
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="筛选" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {filters.map((filter) => (
            <SelectItem key={filter.value} value={filter.value}>
              {filter.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
