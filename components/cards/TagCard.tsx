import ROUTES from "@/constants/routes";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import { cn, getDeviconClassName, getTagDescription } from "@/lib/utils";
import Image from "next/image";

interface Props {
  _id: number | string;
  name: string[] | string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
  remove?: boolean;
  handleRemove?: () => void;
  isButton?: boolean;
}

export default function TagCard({
  _id,
  name,
  questions,
  showCount,
  compact,
  remove,
  handleRemove,
  isButton,
}: Props) {
  const iconClassName = getDeviconClassName(name);
  const iconDescription = getTagDescription(name);

  const Content = (
    <>
      <Badge
        className="flex flex-row gap-2 subtle-medium background-light800_dark300
        text-light400_light500 rounded-md border-none px-4 py-2 uppercase"
      >
        <div className="flex-center space-x-2">
          <i className={`${iconClassName} text-sm`}></i>
          <span>{name}</span>
        </div>
        {remove && (
          <Image
            src="/icons/close.svg"
            width={12}
            height={12}
            className="cursor-pointer object-contain invert-0 dark:invert"
            alt="关闭标签"
            onClick={handleRemove}
          />
        )}
      </Badge>
      {showCount && (
        <p className="small-medium text-dark500_light700">{questions}</p>
      )}
    </>
  );

  if (compact) {
    return isButton ? (
      <button
        className="flex justify-between gap-2"
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
        }}
      >
        {Content}
      </button>
    ) : (
      <Link
        className="flex justify-between gap-2"
        href={ROUTES.TAG(_id.toString())}
      >
        {Content}
      </Link>
    );
  }
  return (
    <Link
      href={ROUTES.TAG(_id.toString())}
      className="shadow-light100_darknone"
    >
      <article className="background-light900_dark200 light-border flex w-full h-full flex-col rounded-2xl border px-8 py-10 sm:h-[214px] sm:w-[260px]">
        <div className="flex items-center justify-between gap-3">
          <div className="background-light800_dark400! w-fit rounded-sm px-5 py-1.5">
            <p className="paragraph-semibold text-dark300_light900">{name}</p>
          </div>
          <i className={cn(iconClassName, "text-2xl")} aria-hidden="true"></i>
        </div>
        <p className="small-regular text-dark500_light700 mt-5 line-clamp-3 w-full">
          {iconDescription}
        </p>
        <p className="small-medium text-dark400_light500 mt-3.5">
          <span className="body-semibold text-primary-500 mr-2.5">
            {questions}+
          </span>
          问题
        </p>
      </article>
    </Link>
  );
}
