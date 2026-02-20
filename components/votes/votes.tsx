"use client";

import { createVote } from "@/lib/actions/vote.action";
import { formatNumber } from "@/lib/utils";
import { HasVotedResponse } from "@/types/action";
import { ActionRespone } from "@/types/global";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { use } from "react";
import { toast } from "sonner";

interface VotesProps {
  upvotes: number;
  downvotes: number;
  targetId: string;
  targetType: "question" | "answer";
  hasVotedPromise: Promise<ActionRespone<HasVotedResponse>>;
}

export default function votes({
  upvotes,
  downvotes,
  hasVotedPromise,
  targetId,
  targetType,
}: VotesProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const session = useSession();
  const { success, data } = use(hasVotedPromise);
  const { hasUpvoted, hasDownvoted } = data || {};
  const userId = session?.data?.user?.id;

  async function handleVote(voteType: "upvote" | "downvote") {
    if (!userId) {
      toast("请先登录后再进行投票");
      return;
    }
    setIsLoading(true);
    try {
      const result = await createVote({
        targetId,
        targetType,
        voteType,
      });

      if (!result.success) {
        return toast.error("投票失败，请稍后再试");
      }

      const successMessage =
        voteType === "upvote"
          ? `${hasUpvoted ? "取消点赞成功" : "点赞成功"}`
          : `${hasDownvoted ? "取消点踩成功" : "点踩成功"}`;
      toast.success(successMessage);
    } catch (error) {
      return toast.error("投票失败，请稍后再试");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap1.5">
        <Image
          src={
            success && hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"
          }
          width={18}
          height={18}
          alt="点赞"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Upvote"
          onClick={() => !isLoading && handleVote("upvote")}
        />
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(upvotes)}
          </p>
        </div>
      </div>
      <div className="flex-center gap1.5">
        <Image
          src={
            success && hasDownvoted
              ? "/icons/downvoted.svg"
              : "/icons/downvote.svg"
          }
          width={18}
          height={18}
          alt="点踩"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Downvote"
          onClick={() => !isLoading && handleVote("downvote")}
        />
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(downvotes)}
          </p>
        </div>
      </div>
    </div>
  );
}
