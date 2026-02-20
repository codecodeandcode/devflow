import { NextResponse } from "next/server";

interface QuestionCardProps {
  _id: string;
  title: string;
  content: string;
  tags: Tags[];
  author: Author;
  createdAt: Date;
  upvotes: number;
  answers: number;
  views: number;
}

interface Tags {
  _id: string;
  name: string;
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

export interface Question {
  _id: string;
  title: string;
  content: string;
  tags: Tags[];
  views: number;
  upvotes: number;
  downvotes: number;
  answers: number;
  author: Schema.Types.ObjectId;
  createdAt: Date;
}

export interface PaginationSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
}

interface AnswerDB {
  _id: string;
  author: Author;
  content: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
}

interface UserDB {
  _id: string;
  name: string;
  username: string;
  email: string;
  image?: string;
  bio?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
}
