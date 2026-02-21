import TagCard from "@/components/cards/TagCard";
import DataRenderer from "@/components/DataRenderer";
import ROUTES from "@/constants/routes";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getTopTags } from "@/lib/actions/tag.action";
import Image from "next/image";
import Link from "next/link";
import { title } from "process";
import React from "react";
import { toast } from "sonner";

export default async function RightSideBar() {
  const [
    { success, data: hotQuestions, error },
    { success: tagSuccess, data: tags, error: tagError },
  ] = await Promise.all([getHotQuestions(), getTopTags()]);

  if (!tags || !hotQuestions) {
    toast.error("加载侧边栏数据失败");
  }
  return (
    <section
      className="pt-36 custom-scrollbar
    background-light900_dark200 light-border sticky top-0 right-0
    flex h-screen w-[350px] flex-col gap-6 overflow-y-auto
    border-l p-6 shadow-light-300 dark:shadow-none max-xl:hidden"
    >
      <div>
        <h3 className="h3-bold text-dark200_light900">热门问题</h3>
        <DataRenderer
          success={success}
          error={error}
          data={hotQuestions}
          empty={{
            title: "暂时没有问题",
            message: "快去提问吧！",
          }}
          render={(data) => (
            <div className="mt-7 flex flex-col gap-[30px]">
              {data.map(({ _id, title }) => (
                <Link
                  key={_id}
                  href={ROUTES.QUESTION(_id)}
                  className="flex cursor-pointer items-center justify-between gap-7"
                >
                  <p className="body-medium text-dark500_light700">{title}</p>
                  <Image
                    src={"/icons/chevron-right.svg"}
                    width={20}
                    height={20}
                    alt="chevron"
                    className="invert-colors"
                  ></Image>
                </Link>
              ))}
            </div>
          )}
        />
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">热门标签</h3>
        <DataRenderer
          success={tagSuccess}
          error={tagError}
          data={tags?.tags}
          empty={{
            title: "暂时没有标签",
            message: "快去创建标签吧！",
          }}
          render={(tags) => (
            <div className="mt-7 flex flex-col gap-[30px]">
              {tags.map(({ _id, name, questions }) => (
                <TagCard
                  key={_id}
                  _id={_id}
                  name={name}
                  questions={questions}
                  showCount
                  compact
                />
              ))}
            </div>
          )}
        />
      </div>
    </section>
  );
}
