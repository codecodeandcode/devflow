import User from "@/database/user.model";
import { handleError } from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnet from "@/lib/mongoose";
import { UserSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnet();
    const users = await User.find();
    return NextResponse.json(
      {
        success: true,
        data: users,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

//创建用户
export async function POST(request: Request) {
  try {
    await dbConnet();

    const body = request.json();
    const validatedData = UserSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }
    const { username, email } = validatedData.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("用户已经存在");

    const existingUsername = await User.findOne({ username });
    if (existingUsername) throw new Error("用户名已经存在");

    const newUser = await User.create(validatedData.data);

    return NextResponse.json({ success: true, data: newUser }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
