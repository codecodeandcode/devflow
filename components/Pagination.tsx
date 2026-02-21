"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import next from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/url";

interface Props {
  page: number | undefined | string;
  isNext: boolean | undefined;
  containerClass?: string;
}

export default function Pagination({
  page = 1,
  isNext,
  containerClass,
}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  function handleNavigation(type: "prev" | "next") {
    const nextPageNumber =
      type === "prev" ? Number(page) - 1 : Number(page) + 1;

    const value = nextPageNumber >= 1 ? nextPageNumber.toString() : "";

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value,
    });
    router.push(newUrl);
  }

  return (
    <div
      className={cn(
        "flex w-full items-center justify-center gap-2 mt-5",
        containerClass
      )}
    >
      {Number(page) > 1 && (
        <Button
          onClick={() => handleNavigation("prev")}
          className="light-border-2 btn flex min-h-[36px] items-center jusitfy-center gap-2
        border"
        >
          <p className="body-medium text-dark200_light800">上一页</p>
        </Button>
      )}

      <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className="body-semibold text-dark200_light900">{page}</p>
      </div>
      {isNext && (
        <Button
          onClick={() => handleNavigation("next")}
          className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2
        border"
        >
          <p className="body-medium  text-dark200_light800">下一页</p>
        </Button>
      )}
    </div>
  );
}
