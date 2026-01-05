import _ from "lodash";
import openapiTS, { astToString } from "openapi-typescript";

export function makeBaseClientString() {
  return `/* eslint-disable @typescript-eslint/no-explicit-any */
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
    "queryFn"
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
  baseUrl: (process.env.NEXT_PUBLIC_API_URL || "").replace(/\\/+$/, ""),
  credentials: "include",
  querySerializer: defaultQuerySerializer,
  bodySerializer: defaultBodySerializer,
});

export function isNonApiError(e: unknown): e is Error {
  return e instanceof Error;
}
`;
}

export async function makeDeclareString(openapi: string) {
  const ast = await openapiTS(openapi, {
    inject: "/* eslint-disable @typescript-eslint/ban-types */",
    transform: (schemaObject, options) => {
      if (
        schemaObject.title === "Lab Space Id" &&
        options.path?.startsWith("#/paths")
      ) {
        schemaObject.oneOf = [{ type: "string" }, { type: "number" }];
      }
      if (schemaObject.title === "Project Id") {
        schemaObject.type = "string";
      }
      return undefined;
    },
  });

  return astToString(ast);
}

const baseUseQuery = `/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CustomUseQueryOptions,
  RequiredFetchRequest,
  RequiredFetchResponse,
  paths,
} from "../base.client";
import { client } from "../base.client";
import { useQuery } from "@tanstack/react-query";
import type { FetchOptions } from "openapi-fetch";

const ENDPOINT = "#ENDPOINT#";

type ENDPOINT = typeof ENDPOINT;
type Path = paths[ENDPOINT];
type Method = "get";
type Api = Path[Method];

type _FetchResponse = RequiredFetchResponse<ENDPOINT, Method>;
type _FetchRequest = RequiredFetchRequest<ENDPOINT, Method>;
export type #PASCAL_FUNCTION_NAME#Data = _FetchResponse["data"];
export type #PASCAL_FUNCTION_NAME#Error = _FetchResponse["error"];
export type #PASCAL_FUNCTION_NAME#Params = _FetchRequest["params"];
export type #PASCAL_FUNCTION_NAME#Body = _FetchRequest["body"];

export const #FUNCTION_NAME# = async (options: FetchOptions<Api>) => {
  return await client.GET(ENDPOINT, options);
};

export const #FUNCTION_NAME#QueryKey = (
  params?: #PASCAL_FUNCTION_NAME#Params,
): readonly unknown[] => (params ? [ENDPOINT, params] : [ENDPOINT]);

export function #HOOK_NAME#(
  { params, body, ...options }: CustomUseQueryOptions<ENDPOINT, Method>,
  fetchOptions?: Partial<FetchOptions<Api>>,
) {
  return useQuery({
    ...options,
    queryKey: #FUNCTION_NAME#QueryKey(params),
    queryFn: async ({ signal }) => {#PREPROCESS#
      const { data, error, response } = await #FUNCTION_NAME#({
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
`;

export function makeUseQueryString(
  endpoint: string,
  {
    operationId = "",
    deprecated = false,
  }: { operationId?: string | null; deprecated?: boolean },
) {
  if (!operationId) {
    operationId = endpoint
      .split("/")
      .filter((x) => !x.includes("{"))
      .slice(1)
      .join("_");
  }

  const functionName = _.camelCase(operationId);
  const pascalFunctionName = _.upperFirst(functionName);
  const hookName = `use${pascalFunctionName}Query`;
  const functionString = baseUseQuery
    .replaceAll("#ENDPOINT#", endpoint)
    .replaceAll("#FUNCTION_NAME#", functionName)
    .replaceAll("#PASCAL_FUNCTION_NAME#", pascalFunctionName)
    .replaceAll("#HOOK_NAME#", hookName)
    .replaceAll(
      "#PREPROCESS#",
      deprecated ? `\n      console.warn("Deprecated ${functionName}")` : "",
    );

  return { hookName, functionString };
}

const baseMutation = `/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CustomUseMutationOptions,
  RequiredFetchRequest,
  RequiredFetchResponse,
  paths,
} from "../base.client";
import { client } from "../base.client";
import { useMutation } from "@tanstack/react-query";
import type { FetchOptions } from "openapi-fetch";

const ENDPOINT = "#ENDPOINT#";

type ENDPOINT = typeof ENDPOINT;
type Path = paths[ENDPOINT];
type Method = "#METHOD#";
type Api = Path[Method];

type _FetchResponse = RequiredFetchResponse<ENDPOINT, Method>;
type _FetchRequest = RequiredFetchRequest<ENDPOINT, Method>;
export type #PASCAL_FUNCTION_NAME#Data = _FetchResponse["data"];
export type #PASCAL_FUNCTION_NAME#Error = _FetchResponse["error"];
export type #PASCAL_FUNCTION_NAME#Params = _FetchRequest["params"];
export type #PASCAL_FUNCTION_NAME#Body = _FetchRequest["body"];

export const #FUNCTION_NAME# = async (options: FetchOptions<Api>) => {
  return await client.#METHOD_UPPER#(ENDPOINT, options);
};

const errorTypeGuard = (x: unknown, y: unknown): x is #PASCAL_FUNCTION_NAME#Data => {
  return !y;
};

export function #HOOK_NAME#(
  options?: CustomUseMutationOptions<ENDPOINT, Method>,
  fetchOptions?: Partial<FetchOptions<Api>>,
) {
  return useMutation({
    ...options,
    mutationFn: async ({ params, body }) => {#PREPROCESS#
      const { data, error, response } = await #FUNCTION_NAME#({
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
`;

export function makeUseMutationString(
  method: string,
  endpoint: string,
  {
    operationId = "",
    deprecated = false,
  }: { operationId?: string | null; deprecated?: boolean },
) {
  if (deprecated) {
    return;
  }

  if (!operationId) {
    operationId = endpoint
      .split("/")
      .filter((x) => !x.includes("{"))
      .slice(1)
      .join("_");
  }

  const functionName = _.camelCase(operationId);
  const pascalFunctionName = _.upperFirst(functionName);
  const hookName = `use${pascalFunctionName}Mutation`;
  const functionString = baseMutation
    .replaceAll("#METHOD#", method)
    .replaceAll("#METHOD_UPPER#", method.toUpperCase())
    .replaceAll("#ENDPOINT#", endpoint)
    .replaceAll("#FUNCTION_NAME#", functionName)
    .replaceAll("#PASCAL_FUNCTION_NAME#", pascalFunctionName)
    .replaceAll("#HOOK_NAME#", hookName)
    .replaceAll(
      "#PREPROCESS#",
      deprecated ? `\n      console.warn("Deprecated ${functionName}")` : "",
    );

  return { hookName, functionString };
}
