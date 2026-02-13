"use client";

import { SheetClose } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { text } from "stream/consumers";

export default function NavLinks({
  isMobileNav = false,
  userId,
}: {
  isMobileNav: boolean;
  userId?: string;
}) {
  const pathName = usePathname();

  return (
    <>
      {sidebarLinks.map((item) => {
        const isActive =
          (pathName.includes(item.label) && item.route.length > 1) ||
          item.route === pathName;
        if (item.route === "/profile") {
          if (userId) item.route = `${item.route}/${userId}`;
          else return null;
        }

        const LinkComponent = (
          <Link
            href={item.route}
            key={item.label}
            className={cn(
              isActive
                ? `primary-gradient rounded-lg text-light-900`
                : `text-dark300_light900`,
              "flex items-center justify-start gap-4 bg-transparent p-4"
            )}
          >
            <Image
              className={cn({ "inverted-colors": !isActive })}
              src={item.imgURL}
              alt={item.label}
              width={20}
              height={20}
            />
            <p
              className={cn(
                isActive ? "base-bold" : "base-medium",
                !isMobileNav && "max-lg:hidden"
              )}
            >
              {" "}
              {item.label}
            </p>
          </Link>
        );
        return isMobileNav ? (
          <SheetClose asChild key={item.route}>
            {LinkComponent}
          </SheetClose>
        ) : (
          <React.Fragment key={item.route}>{LinkComponent}</React.Fragment>
        );
      })}
    </>
  );
}
