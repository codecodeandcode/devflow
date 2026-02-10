import { email, z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, "请填入邮箱")
    .email({ message: "请输入有效的邮箱地址" }),

  password: z
    .string()
    .min(6, { message: "密码必须大于6个字符" })
    .max(50, { message: "太长了,你记不住" }),
});

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "用户名必须大于3个字符." })
    .max(30, { message: "用户名不能超过30个字符" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "用户名只能包含数字,字母,下划线",
    }),

  email: z
    .string()
    .min(1, { message: "请填入邮箱." })
    .email({ message: "请输入有效的邮箱地址." }),

  password: z
    .string()
    .min(6, { message: "密码必须大于6个字符" })
    .max(50, { message: "密码必须小于50个字符." })
    .regex(/[A-Z]/, {
      message: "密码必须包含小写字母.",
    })
    .regex(/[a-z]/, {
      message: "密码必须包含大写字母.",
    })
    .regex(/[0-9]/, { message: "密码必须包含数字" }),
});

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(5, { message: "需要标题" })
    .max(100, { message: "标题不能超过100个字符" }),
  content: z.string().min(10, { message: "需要内容" }),
  tag: z
    .array(
      z
        .string()
        .min(1, { message: "标签不能为空" })
        .max(30, { message: "标签不能超过30个字符" })
    )
    .min(1, { message: "至少需要一个标签" })
    .max(3, { message: "最多只能有3个标签" }),
});

export const UserSchema = z.object({
  name: z.string().min(1, { message: "需要姓名" }),
  username: z.string().min(3, { message: "需要用户名" }),
  email: z.string().email({ message: "请提供有效的邮箱" }),
  bio: z.string().optional(),
  image: z.string().url({ message: "请输入有效的URL" }).optional(),
  location: z.string().optional(),
  portfolio: z.string().url({ message: "请输入有效的URL" }).optional(),
  reputation: z.number().optional(),
});
