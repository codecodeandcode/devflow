"use server";

import { ActionRespone, ErrorResponse } from "@/types/global";
import { AskQuestionSchema } from "../validation";
import action from "../handlers/action";
import { handleError } from "../handlers/error";
import mongoose from "mongoose";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import TagQuestion from "@/database/tagQuestion.model";

export async function createQuestion(
  params: CreateQuestionParams
): Promise<ActionRespone<{ _id: string }>> {
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  const { title, content, tags } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  try {
    const [question] = await Question.create(
      [{ title, content, author: userId }],
      {
        session,
      }
    );
    if (!question) {
      throw new Error("Failed to create question");
    }
    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, new: true, session }
      );
      tagIds.push(existingTag._id);
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });
    }

    await TagQuestion.insertMany(tagQuestionDocuments, { session });
    await Question.findByIdAndUpdate(
      question._id,
      { $push: { tags: { $each: tagIds } } },
      { session }
    );

    await session.commitTransaction();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
      status: 200,
    };
  } catch (error) {
    session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
