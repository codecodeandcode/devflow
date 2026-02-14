import { RouterParams } from "@/types/global";
import React from "react";

export default async function QuestionDetail({ params }: RouterParams) {
  const { id } = await params;
  return <div>QuestionDetail{id}</div>;
}
