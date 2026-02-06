"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/url";

const filters = [
  { name: "最新", value: "newest" },
  { name: "最热", value: "popular" },
  { name: "未解答", value: "unanswered" },
  { name: "推荐", value: "recommended" },
];

export default function HomeFilter() {
  const router = useRouter();
  const param = useSearchParams();
  const searchParams = param.get("filter");
  const [active, setActive] = useState(searchParams || "");

  function handleFilter(filter: string) {
    let newUrl = "";
    if (filter == active) {
      setActive("");
      newUrl = removeKeysFromQuery({
        params: param.toString(),
        keysToRemove: ["filter"],
      });
    } else {
      setActive(filter);
      newUrl = formUrlQuery({
        params: param.toString(),
        key: "filter",
        value: filter.toLowerCase(),
      });
    }
    router.push(newUrl, { scroll: false });
  }

  return (
    <div className="mt-10 hidden flex-wrap gap-3 sm:flex">
      {filters.map((filter) => {
        return (
          <Button
            className={cn(
              `body-medium rounded-lg px-6 py-3 capitalize shadow-none`,
              active === filter.value
                ? "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400"
                : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
            )}
            key={filter.name}
            onClick={() => handleFilter(filter.value)}
          >
            {filter.name}
          </Button>
        );
      })}
    </div>
  );
}
