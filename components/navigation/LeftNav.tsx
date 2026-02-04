import { usePathname } from "next/navigation";
import NavLinks from "./navbar/NavLinks";
import ROUTES from "@/constants/routes";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

export default function LeftNavBar() {
  const pathName = usePathname();

  return (
    <section
      className="custom-scrollbar background-light900_dark200
    light-border sticky left-0 top-0 h-screen flex flex-col justify-between
    overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none
    max-sm:hidden lg:w-[266px]"
    >
      <div className="flex flex-1 flex-col gap-6">
        <NavLinks isMobileNav={false} />
      </div>
      <div className="flex flex-col gap-3">
        <Button
          className="hover:cursor-pointer small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3
                shadow-none"
          asChild
        >
          <Link href={ROUTES.SIGN_IN}>
            <Image
              src={"/icons/account.svg"}
              alt="Account"
              width={20}
              height={20}
            ></Image>
            <span className="primary-text-gradient max-lg:hidden">登录</span>
          </Link>
        </Button>
        <Button
          className="hover:cursor-pointer small-medium btn-tertiary light-border-2
          text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3
                shadow-none"
          asChild
        >
          <Link href={ROUTES.SIGN_IN}>
            <Image
              src={"/icons/sign-up.svg"}
              alt="Account"
              width={20}
              height={20}
            ></Image>
            <span className="invert-colors max-lg:hidden">注册</span>
          </Link>
        </Button>
      </div>
    </section>
  );
}
