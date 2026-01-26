import { UndefinedInitialDataInfiniteOptions, useInfiniteQuery } from "@tanstack/react-query";
import {
  GetSummaryListV1SummaryGetParams,
  GetSummaryListV1SummaryGetError,
  getSummaryListV1SummaryGet,
  getSummaryListV1SummaryGetQueryKey,
  GetSummaryListV1SummaryGetData,
} from "src/lib/api-v1/query/useGetSummaryListV1SummaryGetQuery";

function useGetInfiniteSummaryList({
  params,
  options,
}: {
  params: GetSummaryListV1SummaryGetParams;
  options?: UndefinedInitialDataInfiniteOptions<
    GetSummaryListV1SummaryGetData,
    GetSummaryListV1SummaryGetError
  >;
}) {
  const { data, fetchNextPage, hasNextPage, isFetching, isSuccess, error } = useInfiniteQuery({
    queryKey: getSummaryListV1SummaryGetQueryKey(params),
    initialPageParam: 1,
    queryFn: async ({ pageParam = 0, signal }) => {
      const { data, error, response } = await getSummaryListV1SummaryGet({
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
