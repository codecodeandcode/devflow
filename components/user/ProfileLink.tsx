import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  imgUrl: string;
  href?: string;
  title: string;
}

export default function ProfileLink({ imgUrl, href, title }: Props) {
  return (
    <div className="flex-center gap-1">
      <Image src={imgUrl} alt={title} width={20} height={20} />
      {href ? (
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={href}
          className="paragraph-medium text-link-100"
        >
          {title}
        </Link>
      ) : (
        <p className="paragraph-regular text-dark400_light800">{title}</p>
      )}
    </div>
  );
}
