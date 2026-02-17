import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import HomeFilter from "@/components/filter/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/states";
import { getQuestions } from "@/lib/actions/question.action";
import { handleError } from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import Link from "next/link";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

/*const question = [
  {
    _id: 1,
    title: "如何在React中使用状态管理？",
    content: "我想了解在React应用中如何有效地管理状态，有哪些推荐的库？",
    tags: [
      {
        _id: "1",
        name: ["React"],
      },
      {
        _id: "2",
        name: ["JavaScript"],
      },
    ],
    author: {
      _id: "user1",
      name: "用户A",
      image: "/lover.jpg",
    },
    date: new Date("2023-10-01"),
    upvotes: 10,
    answers: 2,
    view: 150,
  },
  {
    _id: 2,
    title: "JavaScript中的闭包是什么？",
    content: "能否解释一下JavaScript中的闭包概念，并举一些实际应用的例子？",
    tags: [
      {
        _id: "1",
        name: ["React"],
      },
      {
        _id: "2",
        name: ["JavaScript"],
      },
    ],
    author: {
      _id: "user1",
      name: "用户A",
      image: "/lover.jpg",
    },
    date: new Date("2023-10-02"),
    upvotes: 10,
    answers: 2,
    view: 150,
  },
  {
    _id: 3,
    title: "CSS Grid和Flexbox的区别？",
    content:
      "我在布局网页时，不确定什么时候该使用CSS Grid，什么时候该使用Flexbox，能否帮我区分一下？",
    tags: [
      {
        _id: "1",
        name: ["css"],
      },
      {
        _id: "2",
        name: ["html"],
      },
      {
        _id: "3",
        name: ["React"],
      },
      {
        _id: "4",
        name: ["JavaScript"],
      },
    ],
    author: {
      _id: "user1",
      name: "用户A",
      image: "/lover.jpg",
    },
    date: new Date("2023-10-03"),
    upvotes: 10,
    answers: 2,
    view: 150,
  },
  {
    _id: 4,
    title: "如何优化网页的加载速度？",
    content: "有哪些有效的方法可以用来优化网页的加载速度，以提升用户体验？",
    tags: [
      {
        _id: "1",
        name: ["css"],
      },
      {
        _id: "2",
        name: ["html"],
      },
    ],
    author: {
      _id: "user1",
      name: "用户A",
      image: "/lover.jpg",
    },
    date: new Date("2023-10-04"),
    upvotes: 10,
    answers: 2,
    view: 150,
  },
];*/

export default async function Home({ searchParams }: SearchParams) {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const { questions, isNext } = data || {};

  return (
    <>
      <section
        className="flex w-full flex-col-reverse
     justify-between gap-4 sm:flex-row sm:items-center"
      >
        <h1 className="h1-bold text-dark100_light900">所有问题</h1>
        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 text-light-900!"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>去提问</Link>
        </Button>
      </section>
      <section className="mt-10 flex w-full flex-col">
        <LocalSearch
          imgSrc="/icons/search.svg"
          placeholder="搜索问题..."
          otherClass="flex-1"
          route="/"
        />
      </section>
      <HomeFilter />
      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      />
    </>
  );
}
