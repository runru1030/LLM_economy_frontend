import { UndefinedInitialDataInfiniteOptions, useInfiniteQuery } from "@tanstack/react-query";
import {
  getSummaryListV1,
  GetSummaryListV1Data,
  GetSummaryListV1Error,
  GetSummaryListV1Params,
  getSummaryListV1QueryKey,
} from "src/lib/api-v1/query/useGetSummaryListV1Query";

function useGetInfiniteSummaryList({
  params,
  options,
}: {
  params: GetSummaryListV1Params;
  options?: UndefinedInitialDataInfiniteOptions<GetSummaryListV1Data, GetSummaryListV1Error>;
}) {
  const { data, fetchNextPage, hasNextPage, isFetching, isSuccess, error } = useInfiniteQuery({
    queryKey: getSummaryListV1QueryKey(params),
    initialPageParam: 1,
    queryFn: async ({ pageParam = 0, signal }) => {
      const { data, error, response } = await getSummaryListV1({
        params: { query: { ...params?.query, offset: pageParam as number } },
        signal,
      });
      if (!data || error) {
        throw { ...error, response };
      }
      return data;
    },
    getNextPageParam: (data) => {
      const nextOffset = data.offset + data.limit;
      if (nextOffset >= data.total) {
        return undefined;
      }
      return nextOffset;
    },
    ...options,
  });

  return { data, fetchNextPage, hasNextPage, isFetching, isSuccess, error };
}

export { useGetInfiniteSummaryList };
