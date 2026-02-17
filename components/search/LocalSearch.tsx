"use client";

import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/url";

interface Props {
  imgSrc: string;
  placeholder: string;
  otherClass?: string;
  route: string;
  iconPostion?: "left" | "right";
}

export default function LocalSearch({
  imgSrc,
  placeholder,
  otherClass,
  route,
  iconPostion = "left",
}: Props) {
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [search, setSearch] = useState(query);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search === query || search === "") return;
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: search,
        });
        router.push(newUrl);
      } else {
        if (pathName === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["query"],
          });
          router.push(newUrl);
        }
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [search, router, searchParams, route]);

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px]
    grow items-center gap-4 rounded-[10px] px-4 ${otherClass}`}
    >
      {iconPostion === "left" && (
        <Image
          src={imgSrc}
          width={24}
          height={24}
          alt="搜索"
          className="cursor-pointer"
        />
      )}
      <Input
        className="outline-none no-focus paragraph-regular 
        placeholder text-dark400_light700
        border-none shadow-none"
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {iconPostion === "right" && (
        <Image
          src={imgSrc}
          width={15}
          height={15}
          alt="搜索"
          className="cursor-pointer"
        />
      )}
    </div>
  );
}
