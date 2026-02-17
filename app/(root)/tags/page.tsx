import { getTags } from "@/lib/actions/tag.action";
import { filter } from "@mdxeditor/editor";
import React from "react";

export default async function Tags() {
  const params = { page: 1, pageSize: 10, filter: "", query: "" };
  const { success, data, error } = await getTags({ ...params });
  const { tags } = data || {};
  console.log("Tags", JSON.stringify(tags, null, 2));
  return <div>Tags</div>;
}
