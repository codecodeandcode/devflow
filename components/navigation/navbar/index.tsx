import Image from "next/image";
import Link from "next/link";
import Theme from "./theme";
import MobileNavigation from "./MobileNavigation";
import { auth } from "@/auth";
import UserAvatar from "@/components/UserAvatar";

export default async function NavBar() {
  const session = await auth();

  return (
    <nav
      className="fixed z-50 flex-between background-light900_dark200 
       w-full p-6 dark:shadow-none sm:px-12 shadow-light-300 gap-5"
    >
      <Link href={"/"} className="flex items-center gap-1">
        <Image
          src="/images/site-logo.svg"
          width={23}
          height={23}
          alt="DevFlow Logo"
        />
        <p
          className="h2-bold font-space-grotesk text-dark-100
        dark:text-light-900
        max-sm:hidden"
        >
          Dev
          <span className="text-primary-500">Flow</span>
        </p>
      </Link>
      <p className="h3-bold">全局搜索</p>
      <div className="flex-between gap-5">
        <Theme />
        {session?.user?.id && (
          <UserAvatar
            id={session.user.id}
            name={session.user.name!}
            image={session.user?.image}
          />
        )}
        <MobileNavigation />
      </div>
    </nav>
  );
}
