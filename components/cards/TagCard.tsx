import ROUTES from "@/constants/routes";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import { getDeviconClassName } from "@/lib/utils";
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
        href={ROUTES.TAGS(Number(_id))}
      >
        {Content}
      </Link>
    );
  }
}
