"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  FieldValues,
  Path,
  DefaultValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { z, ZodType } from "zod";
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
import Link from "next/link";
import ROUTES from "@/constants/routes";

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T, any, any>; // 增加 any 参数来放宽 Zod 内部结构的严格校验
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T) => Promise<{ success: boolean }>;
  formType: "SIGN_IN" | "SIGN_UP";
}

export default function AuthForm<T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: AuthFormProps<T>) {
  // ---------------------------------------------------------
  // 核心修改 2: 彻底绕过 Resolver 的重载检查
  // 使用 type assertion (as any) 尽管不完美，但在这种泛型封装中是标准做法
  // ---------------------------------------------------------
  const form = useForm<T>({
    resolver: zodResolver(schema as any) as any,
    defaultValues: defaultValues,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    await onSubmit(data);
  };

  const buttonText = formType === "SIGN_IN" ? "登录" : "注册";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
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
                    type={fieldProps.name === "password" ? "password" : "text"}
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
}
