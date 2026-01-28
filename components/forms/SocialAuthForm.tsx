"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import ROUTES from "@/constants/routes";

export default function SocialAuthForm() {
  const buttonClass = `background-dark400_light900 body-medium text-dark200_light800
      min-h-12 flex-1 rounded-2 px-4 py-3.5 hover:cursor-pointer`;

  async function handleSignIn(provider: "github" | "google") {
    try {
      await signIn(provider, {
        callbackUrl: ROUTES.HOME,
      });
    } catch (error) {
      toast.error(
        `${error instanceof Error ? error.message : "在登陆时有一个错误发生"}`
      );
    }
  }

  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      <Button
        className={`${buttonClass}`}
        onClick={() => handleSignIn("github")}
      >
        <Image
          src="/icons/github.svg"
          alt="Github Logo"
          height={20}
          width={20}
          className="invert-colors mr-2.5 object-contain"
        />
        <span>通过Github登录</span>
      </Button>
      <Button
        className={`${buttonClass}`}
        onClick={() => handleSignIn("google")}
      >
        <Image
          src="/icons/google.svg"
          alt="Github Logo"
          height={20}
          width={20}
          className="invert-colors mr-2.5 object-contain"
        />
        <span>通过Google登录</span>
      </Button>
    </div>
  );
}
