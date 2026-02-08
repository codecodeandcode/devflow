import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { techMap } from "@/constants/techMap";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDeviconClassName = (techName: string[] | string) => {
  if (typeof techName === "string") {
    techName = [techName];
  }

  const normalizedTechName = techName
    ?.join(" ")
    .replace(/[ .]/g, "")
    .toLowerCase();

  return techMap[normalizedTechName]
    ? `${techMap[normalizedTechName]} colored`
    : "devicon-devicon-plain";
};

export const getTimeStamp = (date: Date): string => {
  const now = Date.now();
  const past = date.getTime();
  const diff = now - past;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  if (diff < minute) {
    return "刚刚";
  }

  if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`;
  }

  if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`;
  }

  if (diff < month) {
    return `${Math.floor(diff / day)}天前`;
  }

  if (diff < year) {
    const months = Math.floor(diff / month);
    return months === 6 ? "半年前" : `${months}个月前`;
  }

  return `${Math.floor(diff / year)}年前`;
};
