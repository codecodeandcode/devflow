import { handleError } from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { AIAnswerSchema } from "@/lib/validation";
import { APIErrorResponse } from "@/types/global";
import { deepseek } from "@ai-sdk/deepseek";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { question, content } = await req.json();

  try {
    const validatedData = AIAnswerSchema.safeParse({ question, content });
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const text = await generateText({
      model: deepseek("deepseek-chat"),
      prompt:
        "生成一个markdown格式的答案,内容要包含以下问题的解答:" +
        question +
        "，基于一下提供的内容：" +
        content,
      system:
        "你是一个乐于助人的助手，使用 Markdown 格式提供信息丰富的回答。在需要时使用合适的 Markdown 语法来编写标题、列表、代码块和强调内容。对于代码块，请使用简短的小写语言标识符（例如，JavaScript 使用 'js'，Python 使用 'py'，TypeScript 使用 'ts'，HTML 使用 'html'，CSS 使用 'css' 等）",
    });

    return NextResponse.json(
      {
        success: true,
        data: text.text,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
