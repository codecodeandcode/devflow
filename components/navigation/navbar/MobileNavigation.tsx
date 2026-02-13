import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ROUTES from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import NavLinks from "./NavLinks";
import { auth, signOut } from "@/auth";
import { LogOut } from "lucide-react";

export default async function MobileNavigation() {
  const session = await auth();
  const userId = session?.user?.id;
  return (
    <Sheet>
      <SheetTrigger className="hover:cursor-pointer" asChild>
        <Image
          className="invert-colors sm:hidden"
          src="/icons/hamburger.svg"
          height={36}
          width={36}
          alt="
          mobile
          navbar
          "
        />
      </SheetTrigger>
      <SheetContent
        className="background-light900_dark200 border-none"
        side="left"
      >
        <SheetTitle className="hidden">导航</SheetTitle>
        <Link href="/" className="flex items-center gap-1">
          <Image
            alt="Logo"
            width={23}
            height={23}
            src="/images/site-logo.svg"
            className="py-2.25"
          ></Image>
          <p
            className="h2-bold font-space-grotesk text-dark-100
          dark:text-light-900"
          >
            Dev
            <span className="text-primary-500">Flow</span>
          </p>
        </Link>
        <div
          className="no-scrollbar flex h-[calc(100vh-80px)] flex-col
         overflow-y-auto justify-between"
        >
          <SheetClose asChild>
            <section className="flex h-full flex-col gap-6 pt-16">
              <p>Nav Links</p>
              <NavLinks isMobileNav={true} />
            </section>
          </SheetClose>
          <div className="flex flex-col gap-3">
            {userId ? (
              <SheetClose asChild>
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <Button
                    type="submit"
                    className="cursor-pointer base-medium w-fit bg-transparent! px-4 py-3"
                  >
                    <LogOut className="size-5 text-black dark:text-white" />
                    <span className="text-dark300_light900">退出登录</span>
                  </Button>
                </form>
              </SheetClose>
            ) : (
              <>
                <SheetClose asChild>
                  <Link href={ROUTES.SIGN_IN}>
                    <Button
                      className="hover:cursor-pointer small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3
                shadow-none"
                    >
                      <span className="primary-text-gradient">登录</span>
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href={ROUTES.SIGN_IN}>
                    <Button
                      className="hover:cursor-pointer light-border-2 text-dark400_light900 small-medium 
                  btn-tertiary min-h-[41px] w-full rounded-lg border px-4 py-3
                shadow-none"
                    >
                      注册
                    </Button>
                  </Link>
                </SheetClose>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
