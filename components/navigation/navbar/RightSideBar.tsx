import TagCard from "@/components/cards/TagCard";
import ROUTES from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import { title } from "process";
import React from "react";

const hotQuestions = [
  {
    _id: 1,
    title: "如何在React中使用Hooks?",
  },
  {
    _id: 2,
    title: "JavaScript中的闭包是什么?",
  },
  {
    _id: 3,
    title: "CSS Flexbox布局的基本概念?",
  },
  {
    _id: 4,
    title: "如何优化网页的加载速度?",
  },
  {
    _id: 5,
    title: "什么是响应式设计?",
  },
];

const popularTags = [
  {
    _id: 1,
    name: ["React"],
    questions: 1200,
  },
  {
    _id: 2,
    name: ["JavaScript"],
    questions: 1500,
  },
  {
    _id: 3,
    name: ["CSS"],
    questions: 1800,
  },
  {
    _id: 4,
    name: ["HTML"],
    questions: 1100,
  },
];

export default function RightSideBar() {
  return (
    <section
      className="pt-36 custom-scrollbar
    background-light900_dark200 light-border sticky top-0 right-0
    flex h-screen w-[350px] flex-col gap-6 overflow-y-auto
    border-l p-6 shadow-light-300 dark:shadow-none max-xl:hidden"
    >
      <div>
        <h3 className="h3-bold text-dark200_light900">热门问题</h3>
      </div>
      <div className="mt-7 flex w-full flex-col gap-[30px]">
        {hotQuestions.map(({ _id, title }) => {
          return (
            <Link
              key={_id}
              href={ROUTES.PROFILE(_id)}
              className="flex
          cursor-pointer items-center justify-between gap-7"
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
          );
        })}
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">热门标签</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map(({ _id, name, questions }) => (
            <TagCard
              key={_id}
              _id={_id}
              name={name}
              questions={questions}
              compact
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
}
