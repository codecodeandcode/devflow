import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";

export default async function Home() {
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
      过滤器
      <div className="mt-10 flex w-full flex-col gap-6">
        <p>问题卡片</p>
        <p>问题卡片</p>
        <p>问题卡片</p>
        <p>问题卡片</p>
      </div>
    </>
  );
}
