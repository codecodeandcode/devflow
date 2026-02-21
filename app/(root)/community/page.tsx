import UserCard from "@/components/cards/UserCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filter/CommonFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { UserFilters } from "@/constants/filters";
import ROUTES from "@/constants/routes";
import { EMPTY_USERS } from "@/constants/states";
import { getUsers } from "@/lib/actions/user.action";
import { RouterParams } from "@/types/global";
import React from "react";

export default async function Community({ searchParams }: RouterParams) {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query?.length === 1 ? "" : query || "",
    filter: filter || "newest",
  });

  const { users } = data || {};
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">所有用户</h1>
      <div className="mt-11 flex jusitfy-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.COMMUNITY}
          iconPostion="left"
          imgSrc="/icons/search.svg"
          placeholder="搜索优秀的开发者"
          otherClass="flex-1"
        />
        <CommonFilter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <DataRenderer
        success={success}
        data={users}
        empty={EMPTY_USERS}
        render={(users) => {
          return (
            <div className="mt-12 flex flex-wrap gap-5">
              {users.map((user) => (
                <UserCard key={user.name} {...user} />
              ))}
            </div>
          );
        }}
      />
    </div>
  );
}
