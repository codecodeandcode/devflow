import TagCard from "@/components/cards/TagCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filter/CommonFilter";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import { TagFilters } from "@/constants/filters";
import ROUTES from "@/constants/routes";
import { EMPTY_TAGS } from "@/constants/states";
import { getTags } from "@/lib/actions/tag.action";
import { RouterParams } from "@/types/global";

export default async function Tags({ searchParams }: RouterParams) {
  const { page, pageSize, filter, query } = await searchParams;
  const { success, data, error } = await getTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    filter: filter || "popular",
    query: query || "",
  });
  const { tags, isNext } = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 text-3xl">标签</h1>
      <section className="mt-11  sm:flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.TAGS}
          imgSrc="/icons/search.svg"
          placeholder="搜索标签"
          otherClass="flex-1"
          iconPostion="left"
        />
        <CommonFilter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </section>
      <DataRenderer
        empty={EMPTY_TAGS}
        success={success}
        error={error}
        data={tags}
        render={(tags) => (
          <div className="mt-10 flex flex-wrap gap-4 w-full">
            {tags.map((tag) => {
              return <TagCard key={tag._id} {...tag} />;
            })}
          </div>
        )}
      />
      {tags && tags.length > 0 && (
        <Pagination page={page} isNext={isNext || false} />
      )}
    </>
  );
}
