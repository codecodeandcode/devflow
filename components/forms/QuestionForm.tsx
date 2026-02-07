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

export default function QuestionForm() {
  const form = useForm({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: "",
      content: "",
      tag: [],
    },
  });

  function handleCreateQuestion() {}

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
              <FormControl>Editor</FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                详细描述你的问题,提供足够的信息和上下文,以便其他人能够理解和帮助你解决问题.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tag"
          render={({ field: fieldProps }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                标签 <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <div>
                  <Input
                    {...fieldProps}
                    className="paragraph-regular background-light700_dark300 
                    light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                    placeholder="添加标签..."
                  />
                  Tags
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
            className="cursor-pointer primary-gradient w-fit text-light-900!"
          >
            发布问题
          </Button>
        </div>
      </form>
    </Form>
  );
}
