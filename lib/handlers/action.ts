"use server";

import { ZodError, ZodSchema } from "zod";
import { UnauthorhorizedError, ValidationError } from "../http-errors";
import { auth } from "@/auth";
import { Session } from "next-auth";
import dbConnet from "../mongoose";

type ActionOptions<T> = {
  params?: T;
  schema: ZodSchema<T>;
  authorize?: boolean;
};

export default async function action<T>({
  params,
  schema,
  authorize = false,
}: ActionOptions<T>) {
  if (params && schema) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        return new ValidationError(error.flatten().fieldErrors);
      } else {
        return new Error("Schema validation failed");
      }
    }
  }

  let session: Session | null = null;

  if (authorize) {
    session = await auth();
    if (!session) {
      return new UnauthorhorizedError(
        "Session not found. Please sign in to continue."
      );
    }
  }
  await dbConnet();

  return { params, session };
}
