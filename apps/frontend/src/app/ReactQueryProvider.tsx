"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";

export default function ReactQueryProvider({ children }: PropsWithChildren) {
  const [client] = useState(() => {
    const queryClient = new QueryClient({
      queryCache: new QueryCache({
        onError: (error, query) => {
          console.error(error, query);
        },
      }),
      mutationCache: new MutationCache({
        onError: (error) => {
          console.error(error);
        },
      }),
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          staleTime: 10000,
          networkMode: "always",
          retry: 2,
        },
        mutations: {
          networkMode: "always",
        },
      },
    });

    return queryClient;
  });

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
