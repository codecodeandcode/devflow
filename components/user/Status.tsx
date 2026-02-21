import { formatNumber } from "@/lib/utils";
import { BadgeCount } from "@/types/global";
import Image from "next/image";
import React from "react";

interface Props {
  totalQuestions: number;
  totalAnswers: number;
  badges: BadgeCount;
}

function StatsCard({
  imgUrl,
  value,
  title,
}: {
  imgUrl: string;
  value: number;
  title: string;
}) {
  return (
    <div
      className="light-border background-light900_dark300 flex flex-wrap
        items-center justify-evenly gap-4 rounedd-md border p-6 shadow-light-300
        dark:shadow-dark-200"
    >
      <Image src={imgUrl} width={40} height={40} alt={title} />
      <div>
        <p className="paragraph-semibold text-dark200_light900">
          {formatNumber(value)}
        </p>
        <p className="body-medium text-dark300_light700">{title}</p>
      </div>
    </div>
  );
}

export default function Status({
  totalQuestions,
  totalAnswers,
  badges,
}: Props) {
  return (
    <div className="mt-3">
      <h4 className="h3-semibold text-dark200_light900">状态</h4>
      <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
        <div
          className="light-border background-light900_dark300 flex flex-wrap
        items-center justify-start gap-4 rounedd-md border p-6 shadow-light-300
        dark:shadow-dark-200"
        >
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalQuestions)}
            </p>
            <p className="body-medium text-dark400_light700">问题</p>
          </div>

          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalAnswers)}
            </p>
            <p className="body-medium text-dark400_light700">回答</p>
          </div>
        </div>
        <StatsCard
          imgUrl="/icons/gold-medal.svg"
          value={badges.GOLD}
          title="金牌"
        />
        <StatsCard
          imgUrl="/icons/silver-medal.svg"
          value={badges.SILVER}
          title="银牌"
        />
        <StatsCard
          imgUrl="/icons/bronze-medal.svg"
          value={badges.BRONZE}
          title="铜牌"
        />
      </div>
    </div>
  );
}
