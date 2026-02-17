import TagCard from "@/components/cards/TagCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
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
  const { tags } = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 text-3xl">标签</h1>
      <section className="mt-11">
        <LocalSearch
          route={ROUTES.TAGS}
          imgSrc="/icons/search.svg"
          placeholder="搜索标签"
          otherClass="flex-1"
          iconPostion="left"
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
    </>
  );
}
