"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, FieldValues, Path, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ROUTES from "@/constants/routes";
import Link from "next/link";

interface AuthFormProps<T extends FieldValues> {
  // 关键修改：将 schema 定义为可接受 T 的任意 ZodType
  schema: z.ZodType<any, any, any>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean }>;
  formType: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: AuthFormProps<T>) => {
  const form = useForm<T>({
    // 关键修复：显式断言 resolver
    resolver: zodResolver(schema) as any,
    defaultValues: defaultValues as DefaultValues<T>,
  });

  // 关键修复：直接定义处理函数，在 handleSubmit 中断言
  const handleSubmit = async (data: T) => {
    await onSubmit(data);
  };

  const buttonText = formType === "SIGN_IN" ? "登录" : "注册";

  return (
    <Form {...form}>
      <form
        // 使用 as any 避开 SubmitHandler 的逆变类型错误
        onSubmit={form.handleSubmit(handleSubmit as any)}
        className="mt-10 space-y-6"
      >
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as Path<T>}
            render={({ field: fieldProps }) => (
              <FormItem className="flex w-full flex-col gap-2.5">
                <FormLabel className="paragraph-medium text-dark400_light700">
                  {fieldProps.name === "email"
                    ? "邮箱"
                    : fieldProps.name === "password"
                    ? "密码"
                    : fieldProps.name === "username"
                    ? "用户名"
                    : fieldProps.name}
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    type={fieldProps.name === "密码" ? "密码" : "text"}
                    {...fieldProps}
                    className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900"
        >
          {form.formState.isSubmitting
            ? buttonText === "登录"
              ? "登录中..."
              : "注册中..."
            : buttonText}
        </Button>

        {formType === "SIGN_IN" ? (
          <p>
            还没有账户?{" "}
            <Link
              href={ROUTES.SIGN_UP}
              className="paragraph-semibold primary-text-gradient"
            >
              注册
            </Link>
          </p>
        ) : (
          <p>
            已经有账户了?{" "}
            <Link
              href={ROUTES.SIGN_IN}
              className="paragraph-semibold primary-text-gradient"
            >
              登录
            </Link>
          </p>
        )}
      </form>
    </Form>
  );
};

export default AuthForm;
