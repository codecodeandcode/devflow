"use server";

import {
  CreateVoteParams,
  HasVotedParams,
  HasVotedResponse,
  UpdateVoteCountParams,
} from "@/types/action";
import { CreateVoteSchema, HasVotedSchema } from "../validation";
import action from "../handlers/action";
import { handleError } from "../handlers/error";
import { ActionRespone, ErrorResponse } from "@/types/global";
import mongoose, { ClientSession } from "mongoose";
import { Answer, Question, Vote } from "@/database";
import ROUTES from "@/constants/routes";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { createInteraction } from "./interaction.action";

export async function createVote(params: CreateVoteParams) {
  const validationResult = await action({
    params,
    schema: CreateVoteSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ActionRespone;
  }

  const { targetId, targetType, voteType } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  if (!userId) {
    return handleError(new Error("User not authenticated")) as ActionRespone;
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const Model = targetType === "question" ? Question : Answer;

    const contentDoc = await Model.findById(targetId).session(session);

    if (!contentDoc) {
      throw new Error(`${targetType} not found`);
    }

    const contentAuthorId = contentDoc.author.toString();

    const existingVote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      type: targetType,
    }).session(session);

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // 取消投票
        await Vote.deleteOne({
          _id: existingVote._id,
        }).session(session);
        await updateVoteCount(
          { targetId, targetType, voteType, change: -1 },
          session
        );
      } else {
        // 切换投票类型
        await Vote.findByIdAndUpdate(
          existingVote._id,
          { voteType },
          { new: true, session }
        );
        await updateVoteCount(
          { targetId, targetType, voteType, change: 1 },
          session
        );
        await updateVoteCount(
          {
            targetId,
            targetType,
            voteType: existingVote.voteType,
            change: -1,
          },
          session
        );
      }
    } else {
      // 新投票
      await Vote.create(
        [{ author: userId, actionId: targetId, type: targetType, voteType }],
        {
          session,
        }
      );
      await updateVoteCount(
        { targetId, targetType, voteType, change: 1 },
        session
      );
    }

    after(async () => {
      await createInteraction({
        action: voteType,
        actionId: targetId,
        actionTarget: targetType,
        authorId: contentAuthorId,
      });
    });
    await session.commitTransaction();
    revalidatePath(ROUTES.QUESTION(targetId));
    return {
      success: true,
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ActionRespone;
  } finally {
    session.endSession();
  }
}

async function updateVoteCount(
  { targetId, targetType, voteType, change }: UpdateVoteCountParams,
  session?: ClientSession
) {
  const Model = targetType === "question" ? Question : Answer;
  const voteField = voteType === "upvote" ? "upvotes" : "downvotes";

  const result = await Model.findByIdAndUpdate(
    targetId,
    { $inc: { [voteField]: change } },
    { new: true, session }
  );

  if (!result) {
    throw new Error(`Failed to update vote count: ${targetType} not found`);
  }

  return result;
}

export async function hasVoted(
  params: HasVotedParams
): Promise<ActionRespone<HasVotedResponse>> {
  const validationResult = await action({
    params,
    authorize: true,
    schema: HasVotedSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { targetId, targetType } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const vote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      type: targetType,
    });

    if (!vote) {
      return {
        success: true,
        data: {
          hasUpvoted: false,
          hasDownvoted: false,
        },
      };
    }

    return {
      success: true,
      data: {
        hasUpvoted: vote.voteType === "upvote",
        hasDownvoted: vote.voteType === "downvote",
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
