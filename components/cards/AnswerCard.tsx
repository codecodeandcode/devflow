import { AnswerDB } from "@/types/global";
import React from "react";
import UserAvatar from "../UserAvatar";
import ROUTES from "@/constants/routes";
import Link from "next/link";
import { getTimeStamp } from "@/lib/utils";
import Preview from "../editor/Preview";

export default function AnswerCard({
  _id,
  author,
  content,
  createdAt,
}: AnswerDB) {
  return (
    <article className="light-border! border-b py-10">
      <span className="hash-span" id={JSON.stringify(_id)} />
      <div
        className="mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row
      sm:items-center sm:gap-2"
      >
        <div className=" flex flex-1 items-start gap-1 sm:items-center">
          <UserAvatar
            id={author._id}
            name={author.name}
            image={author.image}
            className="size-5 rounded-full object-cover max-sm:mt-2"
          />
          <div className="flex flex-col sm:flex-row sm:items-center max-sm:ml-1">
            <p className="body-semibold text-dark300_light700">
              {author.name ?? "匿名"}
            </p>
            <p className="small-regular text-light400_light500 ml-0.5 mt-1 line-clamp-1 ">
              <span className="max-sm:hidden"> • </span>
              {getTimeStamp(createdAt)}
              回答了
            </p>
          </div>
        </div>
        <div className="flex justify-end">Votes</div>
      </div>
      <Preview content={content} />
    </article>
  );
}
