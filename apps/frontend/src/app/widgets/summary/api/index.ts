import {
  UndefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  getSummaryListV5V1SummaryGet,
  GetSummaryListV5V1SummaryGetData,
  GetSummaryListV5V1SummaryGetError,
  GetSummaryListV5V1SummaryGetParams,
  getSummaryListV5V1SummaryGetQueryKey,
} from "src/lib/api-v1/query/useGetSummaryListV5V1SummaryGetQuery";

function useGetInfiniteSummaryList({
  params,
  options,
}: {
  params: GetSummaryListV5V1SummaryGetParams;
  options?: UndefinedInitialDataInfiniteOptions<
    GetSummaryListV5V1SummaryGetData,
    GetSummaryListV5V1SummaryGetError
  >;
}) {
  const { data, fetchNextPage, hasNextPage, isFetching, isSuccess, error } =
    useInfiniteQuery({
      queryKey: getSummaryListV5V1SummaryGetQueryKey(params),
      initialPageParam: 1,
      queryFn: async ({ pageParam = 0, signal }) => {
        const { data, error, response } = await getSummaryListV5V1SummaryGet({
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
