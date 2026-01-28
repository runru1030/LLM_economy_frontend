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

const ENDPOINT = "/v1/summary";

type ENDPOINT = typeof ENDPOINT;
type Path = paths[ENDPOINT];
type Method = "post";
type Api = Path[Method];

type _FetchResponse = RequiredFetchResponse<ENDPOINT, Method>;
type _FetchRequest = RequiredFetchRequest<ENDPOINT, Method>;
export type CreateProjectV1SummaryPostData = _FetchResponse["data"];
export type CreateProjectV1SummaryPostError = _FetchResponse["error"];
export type CreateProjectV1SummaryPostParams = _FetchRequest["params"];
export type CreateProjectV1SummaryPostBody = _FetchRequest["body"];

export const createProjectV1SummaryPost = async (options: FetchOptions<Api>) => {
  return await client.POST(ENDPOINT, options);
};

const errorTypeGuard = (x: unknown, y: unknown): x is CreateProjectV1SummaryPostData => {
  return !y;
};

export function useCreateProjectV1SummaryPostMutation(
  options?: CustomUseMutationOptions<ENDPOINT, Method>,
  fetchOptions?: Partial<FetchOptions<Api>>,
) {
  return useMutation({
    ...options,
    mutationFn: async ({ params, body }) => {
      const { data, error, response } = await createProjectV1SummaryPost({
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
