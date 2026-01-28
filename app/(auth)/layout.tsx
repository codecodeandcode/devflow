import SocialAuthForm from "@/components/forms/SocialAuthForm";
import Image from "next/image";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main
      className="flex min-h-screen items-center justify-center
      dark:bg-auth-dark bg-auth-light bg-cover bg-center bg-no-repeat
      py-10 px-4"
    >
      <section
        className="light-border background-light800_dark200
      shadow-light100_dark100 min-w-full rounded-[10px] border px-4
      py-10 shadow-md sm:min-w-130 sm:px-8"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-2.5">
            <h1 className="h2-bold text-dark100_light900">加入DevFlow</h1>
            <p className="paragraph-regular text-dark500_light400">
              来让你的问题得到回答
            </p>
          </div>
          <Image
            src="images/site-logo.svg"
            height={50}
            width={50}
            alt="DevFlow logo"
            className="object-contain"
          ></Image>
        </div>
        {children}
        <SocialAuthForm />
      </section>
    </main>
  );
}
