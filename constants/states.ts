import { title } from "process";
import ROUTES from "./routes";
import { int } from "zod";

export const DEFAULT_EMPTY = {
  title: "没有数据",
  message: "看起来数据库正在小憩，用一些数据来叫醒它吧！",
  button: {
    text: "添加数据",
    link: ROUTES.HOME,
  },
};

export const DEFAULT_ERROR = {
  title: "发生错误",
  message: "即使代码也会有难过的一天,我们正在努力修复这个问题，请稍后再试！",
  button: {
    text: "再试一次",
    link: ROUTES.HOME,
  },
};

export const EMPTY_QUESTION = {
  title: "没有问题",
  message: "问题数据库是空的，他在等你提问",
  button: {
    text: "提问",
    link: ROUTES.ASK_QUESTION,
  },
};

export const EMPTY_COLLECTION = {
  title: "没有收藏",
  message: "你还没有收藏任何问题，快去收藏一些你喜欢的问题吧！",
  button: {
    text: "去收藏",
    link: ROUTES.COLLECTION,
  },
};

export const EMPTY_TAGS = {
  title: "没有标签",
  message: "标签数据库是空的，快去添加一些标签吧！",
  button: {
    text: "去添加",
    link: ROUTES.TAGS,
  },
};

export const EMPTY_ANSWERS = {
  title: "没有答案",
  message: "这个问题还没有答案，快去回答吧！",
};

export const EMPTY_USERS = {
  title: "没有用户",
  message: "用户数据库是空的，快去注册吧！",
  button: {
    text: "去注册",
    link: ROUTES.SIGN_IN,
  },
};
