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

const ENDPOINT = "/v1/economy-agent/chat";

type ENDPOINT = typeof ENDPOINT;
type Path = paths[ENDPOINT];
type Method = "post";
type Api = Path[Method];

type _FetchResponse = RequiredFetchResponse<ENDPOINT, Method>;
type _FetchRequest = RequiredFetchRequest<ENDPOINT, Method>;
export type ChatV1EconomyAgentChatPostData = _FetchResponse["data"];
export type ChatV1EconomyAgentChatPostError = _FetchResponse["error"];
export type ChatV1EconomyAgentChatPostParams = _FetchRequest["params"];
export type ChatV1EconomyAgentChatPostBody = _FetchRequest["body"];

export const chatV1EconomyAgentChatPost = async (options: FetchOptions<Api>) => {
  return await client.POST(ENDPOINT, options);
};

const errorTypeGuard = (x: unknown, y: unknown): x is ChatV1EconomyAgentChatPostData => {
  return !y;
};

export function useChatV1EconomyAgentChatPostMutation(
  options?: CustomUseMutationOptions<ENDPOINT, Method>,
  fetchOptions?: Partial<FetchOptions<Api>>,
) {
  return useMutation({
    ...options,
    mutationFn: async ({ params, body }) => {
      const { data, error, response } = await chatV1EconomyAgentChatPost({
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
