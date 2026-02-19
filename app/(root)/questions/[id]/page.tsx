import { auth } from "@/auth";
import AllAnswers from "@/components/answers/AllAnswers";
import TagCard from "@/components/cards/TagCard";
import Preview from "@/components/editor/Preview";
import AnswerForm from "@/components/forms/AnswerForm";
import Metric from "@/components/Metric";
import UserAvatar from "@/components/UserAvatar";
import Votes from "@/components/votes/votes";
import ROUTES from "@/constants/routes";
import { getAnswers } from "@/lib/actions/answer.action";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import { RouterParams } from "@/types/global";
import Link from "next/link";
import { redirect } from "next/navigation";
import { after } from "next/server";

export default async function QuestionDetail({ params }: RouterParams) {
  const { id } = await params;
  const session = await auth();

  const { success, data: question } = await getQuestion({ questionId: id });

  if (!success || !question) return redirect("/404");

  const {
    success: areAnswersLoaded,
    data: answersResult,
    error: answersError,
  } = await getAnswers({
    questionId: id,
    page: 1,
    pageSize: 10,
    filter: "latest",
  });

  const { author, createdAt, answers, views, tags } = question;

  after(async () => {
    await incrementViews({ questionId: id });
  });

  return (
    <>
      <div className="flex-start w-full flex-col ">
        <div className="flex w-full flex-col-reverse justify-between sm:flex-col  ">
          <div className="flex items-center justify-start gap-1 ">
            <UserAvatar
              id={author._id}
              name={author.name}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
              image="/default-avatar.jpg"
            />
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light700">
                {author.name}
              </p>
            </Link>
          </div>
          <div className="flex justify-end">
            <Votes
              upvotes={question.upvotes}
              downvotes={question.downvotes}
              hasupVoted={true}
              hasdownVoted={false}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {question.title}
        </h2>
        <div className="w-full mb-8 mt-5 flex flex-wrap gap-4 justify-start">
          <Metric
            imageUrl="/icons/clock.svg"
            alt="clock icon"
            value={`${getTimeStamp(new Date(createdAt))} 询问`}
            title=""
            textStyles="small-regular text-dark400_light700"
          />
          <Metric
            imageUrl="/icons/message.svg"
            alt="message icon"
            value={answers}
            title=""
            textStyles="small-regular text-dark400_light700"
          />
          <Metric
            imageUrl="/icons/eye.svg"
            alt="eye icon"
            value={formatNumber(views)}
            title=""
            textStyles="small-regular text-dark400_light700"
          />
        </div>
      </div>
      <Preview content={question.content} />
      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <TagCard key={tag._id} _id={tag._id} compact name={tag.name} />
        ))}
      </div>
      <section className="my-5">
        <AllAnswers
          data={answersResult?.answers}
          error={answersError}
          success={areAnswersLoaded}
          totalAnswers={answersResult?.totalAnswers || 0}
        />
      </section>
      <section className="my-5">
        <AnswerForm
          questionId={question._id}
          questionTitle={question.title}
          questionContent={question.content}
        />
      </section>
    </>
  );
}
