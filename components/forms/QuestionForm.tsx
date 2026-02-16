"use client";

import { AskQuestionSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRef, useTransition } from "react";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import * as z from "zod";
import TagCard from "../cards/TagCard";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Question } from "@/types/global";

const Editor = dynamic(() => import("@/components/editor"), {
  // Make sure we turn SSR off
  ssr: false,
});

interface Params {
  question?: Question;
  isEdit?: boolean;
}

export default function QuestionForm({ question, isEdit = false }: Params) {
  const editorRef = useRef<MDXEditorMethods>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AskQuestionSchema>>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: question?.title || "",
      content: question?.content || "",
      tags: question?.tags.map((tag) => tag.name) || [],
    },
  });

  function handleInputKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    fieldProps: { value: string[] }
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      const tagInput = e.currentTarget.value.trim();
      if (
        tagInput &&
        tagInput.length < 15 &&
        !fieldProps.value.includes(tagInput)
      ) {
        form.setValue("tags", [...fieldProps.value, tagInput]);
        e.currentTarget.value = "";
        form.clearErrors("tags");
      } else if (tagInput.length >= 15) {
        form.setError("tags", {
          type: "manual",
          message: "标签长度不能超过15个字符",
        });
      } else if (fieldProps.value.includes(tagInput)) {
        form.setError("tags", {
          type: "manual",
          message: "标签已存在",
        });
      }
    }
  }

  async function handleCreateQuestion(data: z.infer<typeof AskQuestionSchema>) {
    startTransition(async () => {
      if (isEdit && question) {
        const result = await editQuestion({
          questionId: question?._id,
          ...data,
        });
        if (result.success) {
          toast.success("问题发布成功!");
          if (result.data) router.push(ROUTES.QUESTION(result.data._id));
        } else toast.error("发布问题失败,请稍后再试!");
        return;
      }
      const result = await createQuestion(data);
      if (result.success) {
        toast.success("问题发布成功!");
        if (result.data) router.push(ROUTES.QUESTION(result.data._id));
      } else toast.error("发布问题失败,请稍后再试!");
    });
  }

  function handleRemove(tag: string, fieldProps: { value: string[] }) {
    const newTags = fieldProps.value.filter((t) => t !== tag);
    form.setValue("tags", newTags);
    if (newTags.length === 0) {
      form.setError("tags", {
        type: "manual",
        message: "请至少添加一个标签",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleCreateQuestion)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field: fieldProps }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                标题 <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                请用一句话描述你的问题,让更多人看到并提供帮助.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field: fieldProps }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                问题的详细内容 <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Editor
                  fieldChange={fieldProps.onChange}
                  value={fieldProps.value}
                  editorRef={editorRef}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                详细描述你的问题,提供足够的信息和上下文,以便其他人能够理解和帮助你解决问题.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field: fieldProps }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                标签 <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <div>
                  <Input
                    className="paragraph-regular background-light700_dark300 
                    light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                    placeholder="添加标签..."
                    onKeyDown={(e) => handleInputKeyDown(e, fieldProps)}
                  />
                  {fieldProps.value.length > 0 && (
                    <div className="flex-start mt-2.5 flex-wrap gap-2.5">
                      {fieldProps.value.map((tag: string) => (
                        <TagCard
                          key={tag}
                          _id={tag}
                          name={tag}
                          compact
                          remove
                          isButton
                          handleRemove={() => handleRemove(tag, fieldProps)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                添加最多3个标签,用来描述你的问题,让更多人看到并提供帮助.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-16 flex justify-end ">
          <Button
            type="submit"
            disabled={isPending}
            className="cursor-pointer primary-gradient w-fit text-light-900!"
          >
            {isPending ? (
              <>
                <ReloadIcon className="mr-2 size-4 animate-spin" />
                <span>{isEdit ? "编辑中..." : "发布中..."}</span>
              </>
            ) : isEdit ? (
              "编辑问题"
            ) : (
              "发布问题"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
