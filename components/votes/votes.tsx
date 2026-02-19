"use client";

import { formatNumber } from "@/lib/utils";
import { set } from "mongoose";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";

interface VotesProps {
  upvotes: number;
  downvotes: number;
  hasupVoted: boolean;
  hasdownVoted: boolean;
}

export default function votes({
  upvotes,
  downvotes,
  hasupVoted,
  hasdownVoted,
}: VotesProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const session = useSession();
  const userId = session?.data?.user?.id;

  async function handleVote(voteType: "upvote" | "downvote") {
    if (!userId) {
      toast("请先登录后再进行投票");
      return;
    }
    setIsLoading(true);
    try {
      const successMessage =
        voteType === "upvote"
          ? `${hasupVoted ? "取消点赞成功" : "点赞成功"}`
          : `${hasdownVoted ? "取消点踩成功" : "点踩成功"}`;
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
          src={hasupVoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"}
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
          src={hasdownVoted ? "/icons/downvoted.svg" : "/icons/downvote.svg"}
          width={18}
          height={18}
          alt="点赞"
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
