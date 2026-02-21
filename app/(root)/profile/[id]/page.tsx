import { auth } from "@/auth";
import ProfileLink from "@/components/user/ProfileLink";
import UserAvatar from "@/components/UserAvatar";
import { getUser } from "@/lib/actions/user.action";
import { RouterParams } from "@/types/global";
import { notFound } from "next/navigation";
import React from "react";
import dayjs from "dayjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Status from "@/components/user/Status";

export default async function Profile({ params }: RouterParams) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const { success, data, error } = await getUser({ userId: id });

  const loggedUser = await auth();

  if (!success) {
    return (
      <div>
        <div className="h1-bold text-dark100_light900">{error?.message}</div>
      </div>
    );
  }

  const { user, totalAnswers, totalQuestions } = data!;

  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row  sm:w-full">
          <UserAvatar
            id={user._id}
            name={user.name}
            image={user.image || ""}
            className="size-[140px] rounded-full object-cover"
            fallbackClassName="text-6xl font-bold"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{user.name}</h2>
            <p className="paragraph-regular text-dark200_light800">
              @{user.username}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {user.portfolio && (
                <ProfileLink
                  imgUrl="/icons/link.svg"
                  href={user.portfolio}
                  title="作品集"
                />
              )}
              {user.location && (
                <ProfileLink imgUrl="/icons/location.svg" title="作品集" />
              )}
              <ProfileLink
                imgUrl="/icons/calendar.svg"
                title={dayjs(user.createdAt).format("YYYY年MM月")}
              />
            </div>
            {user.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {user.bio}
              </p>
            )}
          </div>
          <div className="flex justify-end max-sm:mb-5 lg:ml-auto max-sm:w-full sm:mt-3">
            {loggedUser?.user?.id === id && (
              <Link href="/profile/edit">
                <Button
                  className="paragraph-medium btn-secondary text-dark300_light900
              min-h-12 min-w-44 px-4 py-3"
                >
                  编辑个人资料
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
      <Status
        totalQuestions={totalQuestions}
        totalAnswers={totalAnswers}
        badges={{
          GOLD: 2,
          SILVER: 5,
          BRONZE: 10,
        }}
      />
    </>
  );
}
