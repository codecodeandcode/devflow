"use client";

import { toggleSaveQuestion } from "@/lib/actions/collection.action";
import { ActionRespone } from "@/types/global";
import { set } from "mongoose";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { use } from "react";
import { toast } from "sonner";

export default function SaveQuestion({
  questionId,
  hasCollectedPromise,
}: {
  questionId: string;
  hasCollectedPromise: Promise<ActionRespone<{ saved: boolean }>>;
}) {
  const session = useSession();
  const userId = session?.data?.user?.id;

  const { data } = use(hasCollectedPromise);

  const hasSaved = data?.saved || false;

  const [isLoading, setIsLoading] = React.useState(false);

  async function handleSave() {
    if (isLoading) return;
    if (!userId) {
      return toast.error("请先登录");
    }
    setIsLoading(true);

    try {
      const { success, data, error } = await toggleSaveQuestion({ questionId });
      if (!success) {
        toast.error(error?.message || "操作失败");
      }
      toast.success(data?.saved ? "已收藏问题" : "已取消收藏");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "操作失败");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Image
      src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
      width={18}
      height={18}
      alt="收藏"
      className={`cursor-pointer ${isLoading ? "opacity-50" : ""}`}
      aria-label="Save Question"
      onClick={handleSave}
    />
  );
}
