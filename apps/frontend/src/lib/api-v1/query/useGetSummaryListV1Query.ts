/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CustomUseQueryOptions,
  RequiredFetchRequest,
  RequiredFetchResponse,
  paths,
} from "../base.client";
import { client } from "../base.client";
import { useQuery } from "@tanstack/react-query";
import type { FetchOptions } from "openapi-fetch";

const ENDPOINT = "/api/v1/summary";

type ENDPOINT = typeof ENDPOINT;
type Path = paths[ENDPOINT];
type Method = "get";
type Api = Path[Method];

type _FetchResponse = RequiredFetchResponse<ENDPOINT, Method>;
type _FetchRequest = RequiredFetchRequest<ENDPOINT, Method>;
export type GetSummaryListV1Data = _FetchResponse["data"];
export type GetSummaryListV1Error = _FetchResponse["error"];
export type GetSummaryListV1Params = _FetchRequest["params"];
export type GetSummaryListV1Body = _FetchRequest["body"];

export const getSummaryListV1 = async (options: FetchOptions<Api>) => {
  return await client.GET(ENDPOINT, options);
};

export const getSummaryListV1QueryKey = (
  params?: GetSummaryListV1Params,
): readonly unknown[] => (params ? [ENDPOINT, params] : [ENDPOINT]);

export function useGetSummaryListV1Query(
  { params, body, ...options }: CustomUseQueryOptions<ENDPOINT, Method>,
  fetchOptions?: Partial<FetchOptions<Api>>,
) {
  return useQuery({
    ...options,
    queryKey: getSummaryListV1QueryKey(params),
    queryFn: async ({ signal }) => {
      const { data, error, response } = await getSummaryListV1({
        params,
        signal,
        body,
        ...fetchOptions,
      });
      
      if (data) {
        return data;
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      throw { ...error, meta: options?.meta, response };
    },
  });
}
