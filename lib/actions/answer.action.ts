"use server";

import Answer, { IAnswer } from "@/database/answer.model";
import { CreateAnswerParams } from "@/types/action";
import { ActionRespone, ErrorResponse } from "@/types/global";
import action from "../handlers/action";
import { CreateAnswerSchema } from "../validation";
import { handleError } from "../handlers/error";
import mongoose from "mongoose";
import { Question } from "@/database";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";

export async function createAnswer(
  params: CreateAnswerParams
): Promise<ActionRespone<IAnswer>> {
  const validationResult = await action({
    params: params,
    schema: CreateAnswerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { content, questionId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const question = await Question.findById(questionId);
    if (!question) {
      throw new Error("问题不存在");
    }
    const [newAnswer] = await Answer.create(
      [
        {
          author: userId!,
          question: questionId,
          content,
        },
      ],
      {
        session,
      }
    );
    if (!newAnswer) {
      throw new Error("答案创建失败");
    }
    question.answers += 1;
    await question.save({ session });
    await session.commitTransaction();

    revalidatePath(ROUTES.QUESTION(questionId));
    return {
      success: true,
      data: JSON.parse(JSON.stringify(newAnswer)),
    };
  } catch (error) {
    session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
