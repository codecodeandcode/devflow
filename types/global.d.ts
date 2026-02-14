import { NextResponse } from "next/server";

interface QuestionCardProps {
  _id: number;
  title: string;
  content: string;
  tags: Tags[];
  author: Author;
  date: Date;
  upvotes: number;
  answers: number;
  view: number;
}

interface Tags {
  _id: string;
  name: string[];
}

interface Author {
  _id: string;
  name: string;
  image: string;
}

type ActionRespone<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

type SuccessResponse<T = null> = ActionRespone<T> & { success: true };
type ErrorResponse = ActionRespone<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccesResponse<T> | ErrorResponse<T>>;

interface RouterParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}
