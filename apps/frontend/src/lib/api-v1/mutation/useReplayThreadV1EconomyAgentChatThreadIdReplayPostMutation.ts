/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CustomUseMutationOptions,
  RequiredFetchRequest,
  RequiredFetchResponse,
  paths,
} from "../base.client";
import { client } from "../base.client";
import { useMutation } from "@tanstack/react-query";
import type { FetchOptions } from "openapi-fetch";

const ENDPOINT = "/v1/economy-agent/chat/{thread_id}/replay";

type ENDPOINT = typeof ENDPOINT;
type Path = paths[ENDPOINT];
type Method = "post";
type Api = Path[Method];

type _FetchResponse = RequiredFetchResponse<ENDPOINT, Method>;
type _FetchRequest = RequiredFetchRequest<ENDPOINT, Method>;
export type ReplayThreadV1EconomyEconomyAgentThreadChatThreadIdReplayPostData =
  _FetchResponse["data"];
export type ReplayThreadV1EconomyEconomyAgentThreadChatThreadIdReplayPostError =
  _FetchResponse["error"];
export type ReplayThreadV1EconomyEconomyAgentThreadChatThreadIdReplayPostParams =
  _FetchRequest["params"];
export type ReplayThreadV1EconomyEconomyAgentThreadChatThreadIdReplayPostBody =
  _FetchRequest["body"];

export const replayThreadV1EconomyEconomyAgentThreadChatThreadIdReplayPost = async (
  options: FetchOptions<Api>,
) => {
  return await client.POST(ENDPOINT, options);
};

const errorTypeGuard = (
  x: unknown,
  y: unknown,
): x is ReplayThreadV1EconomyEconomyAgentThreadChatThreadIdReplayPostData => {
  return !y;
};

export function useReplayThreadV1EconomyEconomyAgentThreadChatThreadIdReplayPostMutation(
  options?: CustomUseMutationOptions<ENDPOINT, Method>,
  fetchOptions?: Partial<FetchOptions<Api>>,
) {
  return useMutation({
    ...options,
    mutationFn: async ({ params, body }) => {
      const { data, error, response } =
        await replayThreadV1EconomyEconomyAgentThreadChatThreadIdReplayPost({
          params,
          body,
          ...fetchOptions,
        });

      if (errorTypeGuard(data, error)) {
        return data;
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      throw { ...error, meta: options?.meta, response };
    },
  });
}
