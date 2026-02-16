import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  imageUrl: string;
  alt: string;
  value: number | string;
  title: string;
  href?: string;
  textStyles?: string;
  isAuthor?: boolean;
  imgStyles?: string;
}

export default function Metric({
  imageUrl,
  alt,
  value,
  title,
  href,
  textStyles,
  isAuthor,
  imgStyles,
}: Props) {
  const metricContent = (
    <>
      <Image
        className={`${imgStyles} rounded-full object-contain`}
        src={imageUrl ? imageUrl : "/default-avatar.jpg"}
        width={16}
        height={16}
        alt={alt ? alt : "avatar"}
      />
      <p className={`${textStyles} flex items-center gap-1`}>
        {value}
        <span
          className={`small-regular line-clamp-1 ${
            isAuthor ? "max-sm:hidden" : ""
          }`}
        >
          {title}
        </span>
      </p>
    </>
  );

  return href ? (
    <Link href={href} className="flex flex-center gap-1">
      {metricContent}
    </Link>
  ) : (
    <div className="flex flex-center gap-1">{metricContent}</div>
  );
}
