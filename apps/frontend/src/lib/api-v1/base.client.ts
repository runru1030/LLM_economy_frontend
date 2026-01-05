/* eslint-disable @typescript-eslint/no-explicit-any */
import type { paths } from "./paths";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import type {
  FetchResponse,
  MaybeOptionalInit,
  ParamsOption,
  RequestBodyOption,
} from "openapi-fetch";
import createClient from "openapi-fetch";
import type {
  FilterKeys,
  HttpMethod,
  MediaType,
} from "openapi-typescript-helpers";

export type { paths } from "./paths";

export type RequiredFetchResponse<
  T extends keyof paths,
  Method extends HttpMethod,
  Media extends MediaType = "application/json",
> = Required<
  FetchResponse<NonNullable<paths[T][Method]>, MaybeOptionalInit<paths[T], Method>, Media>
>;

export type RequiredFetchRequest<
  T extends keyof paths,
  Method extends HttpMethod,
> = ParamsOption<FilterKeys<paths[T], Method>> &
  RequestBodyOption<FilterKeys<paths[T], Method>>;

type SafeMerge<T, U> = (T extends never ? unknown : T) &
  (U extends never ? unknown : U);

export type CustomUseQueryOptions<
  T extends keyof paths,
  Method extends HttpMethod,
  Media extends MediaType = MediaType,
> = RequiredFetchRequest<T, Method> &
  Omit<
    UseQueryOptions<
      RequiredFetchResponse<T, Method, Media>["data"],
      SafeMerge<
        RequiredFetchResponse<T, Method, Media>["error"],
        {
          meta?: any;
          response: Response;
        }
      >
    >,
    "queryFn" | "queryKey"
  >;

export type CustomUseMutationOptions<
  T extends keyof paths,
  Method extends HttpMethod,
  Media extends MediaType = MediaType,
> = Omit<
  UseMutationOptions<
    RequiredFetchResponse<T, Method, Media>["data"],
    SafeMerge<
      RequiredFetchResponse<T, Method, Media>["error"],
      {
        meta?: any;
        response: Response;
      }
    >,
    RequiredFetchRequest<T, Method>
  >,
  "mutationFn"
>;

function defaultQuerySerializer<T = unknown>(q: T): string {
  if (q && typeof q === "object") {
    const search = new URLSearchParams(
      Object.entries(q).flatMap(([key, values]) => {
        if (values === undefined || values === null) {
          return [];
        }

        if (Array.isArray(values)) {
          return values
            .filter((v) => v !== undefined || v !== null)
            .map((value) => [key, value]);
        }

        return [[key, values]];
      }),
    );
    return search.toString();
  }

  return "";
}

function defaultBodySerializer(body: unknown) {
  if (body instanceof FormData) {
    return body;
  }
  return JSON.stringify(body);
}

export const client = createClient<paths>({
  baseUrl: (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, ""),
  credentials: "include",
  querySerializer: defaultQuerySerializer,
  bodySerializer: defaultBodySerializer,
});

export function isNonApiError(e: unknown): e is Error {
  return e instanceof Error;
}
