import { AnswerDB } from "@/types/global";
import React, { Suspense } from "react";
import UserAvatar from "../UserAvatar";
import ROUTES from "@/constants/routes";
import Link from "next/link";
import { getTimeStamp } from "@/lib/utils";
import Preview from "../editor/Preview";
import Votes from "../votes/votes";
import { hasVoted } from "@/lib/actions/vote.action";

interface Props extends AnswerDB {
  containerClasses?: string;
  showReadMore?: boolean;
}

export default function AnswerCard({
  _id,
  author,
  content,
  createdAt,
  upvotes,
  downvotes,
  question,
  containerClasses,
  showReadMore = false,
}: Props) {
  const hasVotedPromise = hasVoted({
    targetId: _id,
    targetType: "answer",
  });
  return (
    <article
      className={`light-border! border-b py-10 ${containerClasses || ""}`}
    >
      <span className="hash-span" id={`answer-${_id}`} />
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
        <div className="flex justify-end">
          <Suspense fallback={<div>Loading...</div>}>
            <Votes
              upvotes={upvotes}
              targetType="answer"
              targetId={_id}
              downvotes={downvotes}
              hasVotedPromise={hasVotedPromise}
            />
          </Suspense>
        </div>
      </div>
      <Preview content={content} />
      {showReadMore && (
        <Link
          href={`/questions/${question}#answer-${_id}`}
          className="body-semibold relative z-10 font-space-grotesk text-primary-500"
        >
          <p className="mt-1">查看完整答案</p>
        </Link>
      )}
    </article>
  );
}
