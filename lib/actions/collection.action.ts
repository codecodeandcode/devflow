"use server";

import { CollectionBaseParams } from "@/types/action";
import { ActionRespone, ErrorResponse } from "@/types/global";
import action from "../handlers/action";
import { CollectionBaseSchema } from "../validation";
import { handleError } from "../handlers/error";
import { Collection, Question } from "@/database";
import { revalidatePath } from "next/cache";

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
      return { success: true, data: { saved: false } };
    } else {
      await Collection.create({
        question: questionId,
        author: userId,
      });
      revalidatePath(`/questions/${questionId}`);
      return { success: true, data: { saved: true } };
    }
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
