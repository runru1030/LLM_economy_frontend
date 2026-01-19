"use client";

import { PropsWithChildren, useEffect } from "react";
import { useGetThreadDetail } from "../api";
import { useAgentStore } from "./provider";

export function AgentStoreDataInjector({
  children,
  threadId,
}: PropsWithChildren<{ threadId: string }>) {
  const query = useGetThreadDetail({ threadId });
  const setThreadDetail = useAgentStore((state) => state.setThreadDetail);

  useEffect(() => {
    if (query.data) {
      setThreadDetail(query.data);
    }
  }, [query.data]);

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
