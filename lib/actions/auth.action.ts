"use server";

import { ActionRespone, ErrorResponse } from "@/types/global";
import action from "../handlers/action";
import { SignUpSchema } from "../validation";
import { handleError } from "../handlers/error";
import mongoose from "mongoose";
import User from "@/database/user.model";
import bcrypt from "bcryptjs";
import Account from "@/database/account.model";
import { signIn } from "@/auth";

export async function signUpWithCredentials(
  params: AuthCredentials
): Promise<ActionRespone> {
  // Sign up logic here
  const validationResult = await action({ params, schema: SignUpSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { email, password, username, name } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const exsistingUser = await User.findOne({ email }).session(session);
    if (exsistingUser) {
      throw new Error("User with this email already exists");
    }
    const existingUsername = await User.findOne({ username }).session(session);
    if (existingUsername) {
      throw new Error("User with this username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [newUser] = await User.create([{ email, username, name }], {
      session,
    });

    await Account.create(
      [
        {
          userId: newUser._id,
          password: hashedPassword,
          name,
          provider: "credentials",
          providerAccountId: email,
        },
      ],
      { session }
    );
    await session.commitTransaction();
    await session.endSession();
    await signIn("credentials", { email, password, redirect: false });
    return { success: true, status: 200 } as ActionRespone;
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
