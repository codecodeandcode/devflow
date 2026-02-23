"use server";

import {
  ActionRespone,
  AnswerDB,
  ErrorResponse,
  PaginationSearchParams,
  UserDB,
} from "@/types/global";
import action from "../handlers/action";
import {
  GetUserAnswersSchema,
  GetUserQuestionsSchema,
  getUserSchema,
  GetUserTagsSchema,
  PaginatedSearchParamsSchema,
} from "../validation";
import { handleError } from "../handlers/error";
import mongoose, { PipelineStage, QueryFilter } from "mongoose";
import { Answer, Question, User } from "@/database";
import {
  GetUserAnswersParams,
  GetUserParams,
  GetUserQuestionsParams,
  GetUserTagsParams,
} from "@/types/action";
import { Question as QuestionDB } from "@/types/global";

export async function getUsers(
  params: PaginationSearchParams
): Promise<ActionRespone<{ users: UserDB[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = validationResult.params!;

  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  const filterQuery: QueryFilter<typeof User> = {};

  if (query) {
    filterQuery.$or = [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case "newset":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { reputation: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }
  try {
    const totalUser = await User.countDocuments(filterQuery);
    const users = await User.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    return {
      success: true,
      data: {
        users: JSON.parse(JSON.stringify(users)),
        isNext: totalUser > skip + users.length,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUser(params: GetUserParams): Promise<
  ActionRespone<{
    user: UserDB;
    totalAnswers: number;
    totalQuestions: number;
  }>
> {
  const validationResult = await action({
    params: params,
    schema: getUserSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const totalQuestions = await Question.countDocuments({ author: userId });
    const totalAnswers = await Answer.countDocuments({ author: userId });
    return {
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(user)),
        totalQuestions,
        totalAnswers,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserQuestions(params: GetUserQuestionsParams): Promise<
  ActionRespone<{
    Questions: QuestionDB[];
    isNext: boolean;
  }>
> {
  const validationResult = await action({
    params: params,
    schema: GetUserQuestionsSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId, page = 1, pageSize = 10 } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  try {
    const totalQuestions = await Question.countDocuments({ author: userId });
    const questions = await Question.find({ author: userId })
      .populate("author", "name image")
      .populate("tags", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    if (!questions) {
      throw new Error("Questions not found");
    }
    return {
      success: true,
      data: {
        Questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUsersAnswers(
  params: GetUserAnswersParams
): Promise<ActionRespone<{ answers: AnswerDB[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: GetUserAnswersSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { userId, page = 1, pageSize = 10 } = validationResult.params!;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = pageSize;

  try {
    const totalAnswers = await Answer.countDocuments({ author: userId });
    const answers = await Answer.find({ author: userId })
      .populate("author", "_id name image")
      .skip(skip)
      .limit(limit);

    const isNext = skip + answers.length < totalAnswers;
    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserTags(params: GetUserTagsParams): Promise<
  ActionRespone<{
    tags: { _id: string; name: string; count: number }[];
  }>
> {
  const validationResult = await action({
    params,
    schema: GetUserTagsSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { userId } = validationResult.params!;

  try {
    const pipeline: PipelineStage[] = [
      {
        $match: { author: new mongoose.Types.ObjectId(userId) },
      },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "_id",
          as: "tagInfo",
        },
      },
      { $unwind: "$tagInfo" },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { _id: "$tagInfo._id", name: "$tagInfo.name", count: 1 } },
    ];

    const tags = await Question.aggregate(pipeline);

    return {
      success: true,
      data: {
        tags: JSON.parse(JSON.stringify(tags)),
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
