"use server";

import { CreateVoteParams, UpdateVoteCountParams } from "@/types/action";
import { CreateVoteSchema, UpdateVoteCountSchema } from "../validation";
import action from "../handlers/action";
import { handleError } from "../handlers/error";
import { ActionRespone } from "@/types/global";
import mongoose, { ClientSession } from "mongoose";
import { Answer, Question, Vote } from "@/database";

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
    const existingVote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    }).session(session);

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        await Vote.deleteOne({
          _id: existingVote._id,
        }).session(session);
        await updateVoteCount(
          { targetId, targetType, voteType, change: -1 },
          session
        );
      } else {
        await Vote.findByIdAndUpdate(
          existingVote._id,
          { voteType },
          { new: true, session }
        );
        await updateVoteCount(
          { targetId, targetType, voteType, change: 1 },
          session
        );
      }
    } else {
      await Vote.create([{ targetId, targetType, voteType, change: 1 }], {
        session,
      });
      await updateVoteCount(
        { targetId, targetType, voteType, change: 1 },
        session
      );
    }
    await session.commitTransaction();
    session.endSession();
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
  params: UpdateVoteCountParams,
  sesssion?: ClientSession
) {
  const validationResult = await action({
    params,
    schema: UpdateVoteCountSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ActionRespone;
  }

  const { targetId, targetType, voteType, change } = validationResult.params!;
  const Model = targetType === "question" ? Question : Answer;
  const voteField = voteType === "upvote" ? "upvotes" : "downvotes";

  try {
    const result = await Model.findByIdAndUpdate(
      targetId,
      { $inc: { [voteField]: change } },
      { new: true, session: sesssion }
    );
    if (!result) {
      return handleError(new Error(`${targetType} not found`)) as ActionRespone;
    }
    return {
      success: true,
    };
  } catch (error) {
    return handleError(error) as ActionRespone;
  }
}
