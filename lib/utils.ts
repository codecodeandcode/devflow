import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { techDescriptionMap, techMap } from "@/constants/techMap";
import { Badges } from "@/types/global";

export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
};

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

export const getTagDescription = (techName: string[] | string): string => {
  if (typeof techName === "string") {
    techName = [techName];
  }

  const normalizedTechName = techName
    ?.join(" ")
    .replace(/[ .]/g, "")
    .toLowerCase();

  if (techDescriptionMap[normalizedTechName]) {
    return techDescriptionMap[normalizedTechName];
  }

  const fallbackName = techName?.[0] || "该技术";
  return `${fallbackName} 相关技术标签`;
};

export const getTimeStamp = (
  createdAt?: Date | string | number | null
): string => {
  if (!createdAt) {
    return "刚刚";
  }

  const date =
    createdAt instanceof Date
      ? createdAt
      : new Date(createdAt as string | number);

  if (Number.isNaN(date.getTime())) {
    return "刚刚";
  }

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

export function formatNumber(num: number) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

export function assignBadges(params: {
  criteria: { type: keyof typeof BADGE_CRITERIA; count: number }[];
}) {
  const badgeCounts: Badges = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };
  const { criteria } = params;

  criteria.forEach((item) => {
    const { type, count } = item;
    const badgeLevels = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level) => {
      if (count >= badgeLevels[level as keyof typeof badgeLevels]) {
        badgeCounts[level as keyof Badges] += 1;
      }
    });
  });
  return badgeCounts;
}
