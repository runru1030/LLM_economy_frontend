"use client";

import { PropsWithChildren, useEffect } from "react";
import { useGetThreadDetail } from "../api";
import { useEconomyAgentThreadStore } from "./provider";

export function EconomyAgentThreadStoreDataInjector({
  children,
  threadId,
}: PropsWithChildren<{ threadId: string }>) {
  const query = useGetThreadDetail({ threadId });
  const setThreadDetail = useEconomyAgentThreadStore((state) => state.setThreadDetail);

  useEffect(() => {
    if (query.data) {
      setThreadDetail(query.data);
    }
  }, [query.data, setThreadDetail]);

  useEffect(() => {
    if (query.error) {
      console.error("Failed to fetch thread detail:", query.error);
    }
  }, [query.error]);

  if (query.isLoading) {
    return <div>Loading...</div>;
  }
  return <>{children}</>;
}
