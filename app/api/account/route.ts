import Account from "@/database/account.model";
import { handleError } from "@/lib/handlers/error";
import { ForbiddenError } from "@/lib/http-errors";
import dbConnet from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnet();
    const accounts = await Account.find();
    return NextResponse.json(
      {
        success: true,
        data: accounts,
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
    const validatedData = AccountSchema.parse(body);

    const exsistingAccount = await Account.findOne({
      provider: validatedData.provider,
      providerAccountId: validatedData.provider,
    });

    if (exsistingAccount) {
      throw new ForbiddenError("已经有相同的providerAccountId存在");
    }

    const newAccount = await Account.create(validatedData);

    return NextResponse.json(
      { success: true, data: newAccount },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
