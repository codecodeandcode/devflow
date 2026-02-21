"use server";

import { CollectionBaseParams } from "@/types/action";
import {
  ActionRespone,
  CollecitonDB,
  ErrorResponse,
  PaginationSearchParams,
} from "@/types/global";
import action from "../handlers/action";
import {
  CollectionBaseSchema,
  PaginatedSearchParamsSchema,
} from "../validation";
import { handleError } from "../handlers/error";
import { Collection, Question } from "@/database";
import { revalidatePath } from "next/cache";
import mongoose, { PipelineStage } from "mongoose";

export async function toggleSaveQuestion(
  params: CollectionBaseParams
): Promise<ActionRespone<{ saved: boolean }>> {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;
  if (!userId) {
    throw new Error("用户未登录");
  }
  try {
    const question = await Question.findById(questionId);
    if (!question) {
      throw new Error("问题不存在");
    }
    const collection = await Collection.findOne({
      question: questionId,
      author: userId,
    });
    if (collection) {
      await Collection.findByIdAndDelete(collection._id);
      revalidatePath(`/questions/${questionId}`);
      revalidatePath("/collection");
      return { success: true, data: { saved: false } };
    } else {
      await Collection.create({
        question: questionId,
        author: userId,
      });
      revalidatePath(`/questions/${questionId}`);
      revalidatePath("/collection");
      return { success: true, data: { saved: true } };
    }
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function hasSavedQuestion(
  params: CollectionBaseParams
): Promise<ActionRespone<{ saved: boolean }>> {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  if (!userId) {
    throw new Error("用户未登录");
  }
  try {
    const collection = await Collection.findOne({
      question: questionId,
      author: userId,
    });
    return {
      success: true,
      data: {
        saved: !!collection,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getSavedCollections(
  params: PaginationSearchParams
): Promise<ActionRespone<{ collection: CollecitonDB[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const userId = validationResult.session?.user?.id;
  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = pageSize;

  const sortOptions: Record<string, Record<string, 1 | -1>> = {
    mostrecent: { "question.createdAt": -1 },
    oldest: { "question.createdAt": 1 },
    mostvoted: { "question.upvotes": -1 },
    mostviewed: { "question.views": -1 },
    mostanswered: { "question.answers": -1 },
  };

  const sortCriteria = sortOptions[filter as keyof typeof sortOptions] || {
    "question.createdAt": -1,
  };
  try {
    const pipeline: PipelineStage[] = [
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "question",
        },
      },
      { $unwind: "$question" },
      {
        $lookup: {
          from: "users",
          localField: "question.author",
          foreignField: "_id",
          as: "question.author",
        },
      },
      { $unwind: "$question.author" },
      {
        $lookup: {
          from: "tags",
          localField: "question.tags",
          foreignField: "_id",
          as: "question.tags",
        },
      },
    ];
    if (query) {
      pipeline.push({
        $match: {
          $or: [
            { "question.title": { $regex: new RegExp(query, "i") } },
            { "question.content": { $regex: new RegExp(query, "i") } },
          ],
        },
      });
    }

    const [totalCount] = await Collection.aggregate([
      ...pipeline,
      { $count: "count" },
    ]);
    pipeline.push({ $sort: sortCriteria }, { $skip: skip }, { $limit: limit });
    pipeline.push({
      $project: {
        question: 1,
        author: 1,
      },
    });
    const questions = await Collection.aggregate(pipeline);
    return {
      success: true,
      data: {
        collection: JSON.parse(JSON.stringify(questions)),
        isNext: questions.length + skip < totalCount.count,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
