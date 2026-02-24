import ROUTES from "@/constants/routes";
import { getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import TagCard from "./TagCard";
import Metric from "../Metric";
import { QuestionCardProps, Tags } from "@/types/global";
import { date } from "zod";
import EditDelete from "../user/EditDelete";

interface Props {
  question: QuestionCardProps;
  showActionBtns?: boolean;
}

export default function QuestionCard({
  question: {
    _id,
    title,
    content,
    tags,
    author,
    createdAt,
    upvotes,
    answers,
    views,
  },
  showActionBtns = false,
}: Props) {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div
        className="flex flex-col-reverse items-center justify-between 
        gap-5 sm:flex-row"
      >
        <div className="flex-1">
          <span
            className="sm:hidden flex line-clamp-1 subtle-regular
          text-dark400_light700"
          >
            {getTimeStamp(createdAt)}
          </span>
          <Link href={ROUTES.QUESTION(String(_id))}>
            <h3
              className="sm:h3-semibold base-semibold text-dark200_light900
            line-clamp-1 flex-1"
            >
              {title}
            </h3>
          </Link>
        </div>
        {showActionBtns && <EditDelete type="Question" itemId={_id} />}
      </div>
      <div className="mt-3.5 flex w-full flex-wrap">
        {tags.map((tag: Tags) => {
          return (
            <TagCard
              key={tag._id}
              _id={Number(tag._id)}
              name={tag.name}
              compact
            />
          );
        })}
      </div>
      <div className="flex-between flex-wrap mt-6 w-full gap-3">
        <Metric
          imageUrl={author.image}
          alt={author.name}
          value={author.name}
          title={`${getTimeStamp(createdAt)} 询问`}
          href={ROUTES.PROFILE(author._id)}
          textStyles="body-medium text-dark400_light700"
          isAuthor
          titleStyles="max-sm:hidden"
        />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imageUrl="/icons/like.svg"
            alt="like"
            value={upvotes}
            title={`赞`}
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imageUrl="/icons/message.svg"
            alt="message"
            value={answers}
            title={`回复`}
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imageUrl="/icons/eye.svg"
            alt="eye"
            value={views}
            title={`看过`}
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
}
