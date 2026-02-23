import { auth } from "@/auth";
import ProfileLink from "@/components/user/ProfileLink";
import UserAvatar from "@/components/UserAvatar";
import {
  getUser,
  getUserQuestions,
  getUsersAnswers,
  getUserTags,
} from "@/lib/actions/user.action";
import { RouterParams } from "@/types/global";
import { notFound } from "next/navigation";
import dayjs from "dayjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Status from "@/components/user/Status";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { EMPTY_ANSWERS, EMPTY_QUESTION, EMPTY_TAGS } from "@/constants/states";
import DataRenderer from "@/components/DataRenderer";
import QuestionCard from "@/components/cards/QuestionCard";
import Pagination from "@/components/Pagination";
import AnswerCard from "@/components/cards/AnswerCard";
import TagCard from "@/components/cards/TagCard";

export default async function Profile({ params, searchParams }: RouterParams) {
  const { id } = await params;
  const { page, pageSize } = await searchParams;

  if (!id) {
    notFound();
  }

  const { success, data, error } = await getUser({ userId: id });

  const loggedUser = await auth();

  if (!success) {
    return (
      <div>
        <div className="h1-bold text-dark100_light900">{error?.message}</div>
      </div>
    );
  }

  const { user, totalAnswers, totalQuestions } = data!;

  const {
    success: userQuestionSuccess,
    data: userQuestionsData,
    error: userQuestionsError,
  } = await getUserQuestions({
    userId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });

  if (userQuestionsError || !userQuestionsData) {
    toast.error(userQuestionsError?.message || "获取用户问题失败");
  }

  const { Questions: questions, isNext } = userQuestionsData!;

  const {
    success: userAnswersSuccess,
    data: userAnswersData,
    error: userAnswersError,
  } = await getUsersAnswers({
    userId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });

  if (userAnswersError || !userAnswersData) {
    toast.error(userAnswersError?.message || "获取用户答案失败");
  }

  const { answers: answers, isNext: isAnswerNext } = userAnswersData!;

  const {
    success: userTagsSuccess,
    data: userTagsData,
    error: userTagsError,
  } = await getUserTags({
    userId: id,
  });

  if (userTagsError || !userTagsData) {
    toast.error(userTagsError?.message || "获取用户标签失败");
  }

  const { tags } = userTagsData!;

  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row  sm:w-full">
          <UserAvatar
            id={user._id}
            name={user.name}
            image={user.image || ""}
            className="size-[140px] rounded-full object-cover"
            fallbackClassName="text-6xl font-bold"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{user.name}</h2>
            <p className="paragraph-regular text-dark200_light800">
              @{user.username}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {user.portfolio && (
                <ProfileLink
                  imgUrl="/icons/link.svg"
                  href={user.portfolio}
                  title="作品集"
                />
              )}
              {user.location && (
                <ProfileLink imgUrl="/icons/location.svg" title="作品集" />
              )}
              <ProfileLink
                imgUrl="/icons/calendar.svg"
                title={dayjs(user.createdAt).format("YYYY年MM月")}
              />
            </div>
            {user.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {user.bio}
              </p>
            )}
          </div>
          <div className="flex justify-end max-sm:mb-5 lg:ml-auto max-sm:w-full sm:mt-3">
            {loggedUser?.user?.id === id && (
              <Link href="/profile/edit">
                <Button
                  className="paragraph-medium btn-secondary text-dark300_light900
              min-h-12 min-w-44 px-4 py-3"
                >
                  编辑个人资料
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
      <Status
        totalQuestions={totalQuestions}
        totalAnswers={totalAnswers}
        badges={{
          GOLD: 2,
          SILVER: 5,
          BRONZE: 10,
        }}
      />
      <section className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-[2]">
          <TabsList className="background-light800_dark400! min-h-[42px] p-1">
            <TabsTrigger className="tab" value="top-posts">
              热门帖子
            </TabsTrigger>
            <TabsTrigger className="tab" value="answers">
              答案
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="top-posts"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <DataRenderer
              success={userQuestionSuccess}
              error={userQuestionsError}
              data={questions}
              empty={EMPTY_QUESTION}
              render={(questions) => (
                <div className="flex flex-col w-full gap-6">
                  {questions.map((question) => (
                    <QuestionCard key={question._id} question={question} />
                  ))}
                </div>
              )}
            />
            {questions && questions.length > 1 && (
              <Pagination page={page} isNext={isNext || false} />
            )}
          </TabsContent>
          <TabsContent className="flex w-full flex-col gap-6" value="answers">
            <DataRenderer
              success={userAnswersSuccess}
              error={userAnswersError}
              data={answers}
              empty={EMPTY_ANSWERS}
              render={(answers) => (
                <div className="flex flex-col w-full gap-6">
                  {answers.map((answer) => (
                    <AnswerCard
                      key={answer._id}
                      {...answer}
                      content={answer.content.slice(0, 27)}
                      showReadMore={true}
                      containerClasses="card-wrapper rounded-[10px] px-7 py-9 sm:px-11"
                    />
                  ))}
                </div>
              )}
            />
            {answers && answers.length > 1 && (
              <Pagination page={page} isNext={isAnswerNext || false} />
            )}
          </TabsContent>
        </Tabs>
        <div className="flex w-full min-w-[250px] flex-1 flex-col max-[55rem]:hidden">
          <h3 className="h3-bold text-dark200_light900">技术栈</h3>
          <div className="mt-7 flex flex-col gap-4">
            <DataRenderer
              success={userTagsSuccess}
              error={userTagsError}
              data={tags}
              empty={EMPTY_TAGS}
              render={(tags) => (
                <div className="flex flex-col w-full mt-3 gap-6">
                  {tags.map((tag) => (
                    <TagCard
                      key={tag._id}
                      _id={tag._id}
                      name={tag.name}
                      questions={tag.count}
                      showCount
                      compact
                    />
                  ))}
                </div>
              )}
            />
          </div>
        </div>
      </section>
    </>
  );
}
