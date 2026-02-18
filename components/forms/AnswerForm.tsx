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
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { ReloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";

const Editor = dynamic(() => import("@/components/editor"), {
  // Make sure we turn SSR off
  ssr: false,
});

export default function AnswerForm() {
  const [issubitting, setIsSubmitting] = useState(false);
  const [isAISubmitting, setIsAISubmitting] = useState(false);

  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: "",
    },
  });

  // 关键修复：直接定义处理函数，在 handleSubmit 中断言
  const handleSubmit = async (value: z.infer<typeof AnswerSchema>) => {
    console.log("提交的答案内容:", value);
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          写下你的答案吧!
        </h4>
        <Button
          className="btn light-border-2 gap-1.5 rounded-md border px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
          disabled={isAISubmitting}
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
              {issubitting ? (
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
