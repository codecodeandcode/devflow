"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { AnswerSchema } from "@/lib/validation";
import { useRef, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { ReloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

const Editor = dynamic(() => import("@/components/editor"), {
  // Make sure we turn SSR off
  ssr: false,
});

export default function AnswerForm({
  questionId,
  questionTitle,
  questionContent,
}: {
  questionId: string;
  questionTitle: string;
  questionContent: string;
}) {
  const [isAnswering, startAnsweringTransition] = useTransition();
  const [isAISubmitting, setIsAISubmitting] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const session = useSession();

  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: "",
    },
  });

  // 关键修复：直接定义处理函数，在 handleSubmit 中断言
  const handleSubmit = async (value: z.infer<typeof AnswerSchema>) => {
    startAnsweringTransition(async () => {
      const result = await createAnswer({
        questionId: questionId,
        content: value.content,
      });
      if (result.success) {
        form.reset();
        toast.success("答案提交成功!");
        setEditorKey((prev) => prev + 1);
      } else {
        toast.error(result.error?.message || "答案提交失败，请重试!");
      }
    });
  };

  async function generateAIAnswer() {
    if (!session) {
      toast.message("请先登录以使用AI生成答案功能!");
      return;
    }
    setIsAISubmitting(true);

    try {
      const { success, data, error } = await api.ai.getAnswer(
        questionTitle,
        questionContent
      );

      if (!success) {
        return toast.error(error?.message || "生成AI答案失败,请重试!");
      }
      const formattedContent = data?.replace(/<br>/g, " ")?.toString()?.trim();
      form.setValue("content", formattedContent!, {
        shouldValidate: true,
        shouldDirty: true,
      });
      await form.trigger("content");

      // MDXEditor 是非受控组件，markdown prop 只在首次挂载时生效
      // 通过更新 key 强制重新挂载编辑器，使新内容生效
      setEditorKey((prev) => prev + 1);
      toast.success("AI答案生成成功!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "生成AI答案失败,请重试!"
      );
    } finally {
      setIsAISubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          写下你的答案吧!
        </h4>
        <Button
          type="button"
          className="btn light-border-2 gap-1.5 rounded-md border px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
          disabled={isAISubmitting}
          onClick={generateAIAnswer}
        >
          {isAISubmitting ? (
            <>
              <ReloadIcon className="mr-2 size-4 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Image
                className="object-contain"
                width={12}
                height={12}
                src="/icons/stars.svg"
                alt="生成AI答案"
              />
              生成AI答案
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form
          // 使用 as any 避开 SubmitHandler 的逆变类型错误
          onSubmit={form.handleSubmit(handleSubmit as any)}
          className="mt-6 flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Editor
                    key={editorKey}
                    value={field.value}
                    editorRef={editorRef}
                    fieldChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" className="primary-gradient w-fit">
              {isAnswering ? (
                <>
                  <ReloadIcon className="mr-2 size-4 animate-spin" />
                  提交中...
                </>
              ) : (
                "提交答案"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
