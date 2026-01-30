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

const ENDPOINT = "/v1/economy-agent/thread/{thread_id}";

type ENDPOINT = typeof ENDPOINT;
type Path = paths[ENDPOINT];
type Method = "get";
type Api = Path[Method];

type _FetchResponse = RequiredFetchResponse<ENDPOINT, Method>;
type _FetchRequest = RequiredFetchRequest<ENDPOINT, Method>;
export type ThreadHistoryV1EconomyAgentThreadThreadIdGetData = _FetchResponse["data"];
export type ThreadHistoryV1EconomyAgentThreadThreadIdGetError = _FetchResponse["error"];
export type ThreadHistoryV1EconomyAgentThreadThreadIdGetParams = _FetchRequest["params"];
export type ThreadHistoryV1EconomyAgentThreadThreadIdGetBody = _FetchRequest["body"];

export const threadHistoryV1EconomyAgentThreadThreadIdGet = async (options: FetchOptions<Api>) => {
  return await client.GET(ENDPOINT, options);
};

export const threadHistoryV1EconomyAgentThreadThreadIdGetQueryKey = (
  params?: ThreadHistoryV1EconomyAgentThreadThreadIdGetParams,
): readonly unknown[] => (params ? [ENDPOINT, params] : [ENDPOINT]);

export function useThreadHistoryV1EconomyAgentThreadThreadIdGetQuery(
  { params, body, ...options }: CustomUseQueryOptions<ENDPOINT, Method>,
  fetchOptions?: Partial<FetchOptions<Api>>,
) {
  return useQuery({
    ...options,
    queryKey: threadHistoryV1EconomyAgentThreadThreadIdGetQueryKey(params),
    queryFn: async ({ signal }) => {
      const { data, error, response } = await threadHistoryV1EconomyAgentThreadThreadIdGet({
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
