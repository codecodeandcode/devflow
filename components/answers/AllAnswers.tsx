import { ActionRespone, AnswerDB } from "@/types/global";
import React from "react";
import DataRenderer from "../DataRenderer";
import { EMPTY_ANSWERS } from "@/constants/states";
import AnswerCard from "../cards/AnswerCard";
import CommonFilter from "../filter/CommonFilter";
import { AnswerFilters } from "@/constants/filters";
import Pagination from "../Pagination";

interface Props extends ActionRespone<AnswerDB[]> {
  totalAnswers: number;
  page: number;
  isNext: boolean;
}

export default function AllAnswers({
  page,
  isNext,
  data,
  error,
  success,
  totalAnswers,
}: Props) {
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers}个答案</h3>
        <CommonFilter
          filters={AnswerFilters}
          otherClasses="sm:min-w-32"
          containerClass="max-xs:w-full"
        />
      </div>
      <DataRenderer
        empty={EMPTY_ANSWERS}
        data={data}
        error={error}
        success={success}
        render={(answers) => {
          return answers.map((answer) => (
            <AnswerCard key={answer._id} {...answer} />
          ));
        }}
      />
      {data && data.length > 0 && (
        <Pagination page={page} isNext={isNext || false} />
      )}
    </div>
  );
}
