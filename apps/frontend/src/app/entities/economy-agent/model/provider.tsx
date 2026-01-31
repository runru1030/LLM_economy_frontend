"use client";

import { PropsWithChildren, createContext, useContext, useEffect, useRef } from "react";
import { useStore } from "zustand";
import { APIThreadDetailResponse } from "../types";
import { EconomyAgentThreadStore, createEconomyAgentThreadStore } from "./store";

import { useGetThreadDetail } from "../api";
type EconomyAgentThreadApi = ReturnType<typeof createEconomyAgentThreadStore>;

const EconomyAgentThreadStoreContext = createContext<EconomyAgentThreadApi | undefined>(undefined);

export const EconomyAgentThreadStoreProvider = ({
  children,
  initialData,
}: PropsWithChildren<{ initialData?: APIThreadDetailResponse }>) => {
  const storeRef = useRef<EconomyAgentThreadApi>(null);

  if (!storeRef.current) {
    storeRef.current = createEconomyAgentThreadStore(initialData);
  }

  return (
    <EconomyAgentThreadStoreContext.Provider value={storeRef.current}>
      {children}
    </EconomyAgentThreadStoreContext.Provider>
  );
};

export function EconomyAgentThreadStoreProviderWithInit({
  children,
  threadId,
}: PropsWithChildren<{ threadId: string }>) {
  const query = useGetThreadDetail({ threadId });

  useEffect(() => {
    if (query.error) {
      console.error("Failed to fetch thread detail:", query.error);
    }
  }, [query.error]);

  if (query.data === undefined) {
    return null;
  }
  return (
    <EconomyAgentThreadStoreProvider initialData={query.data}>
      {children}
    </EconomyAgentThreadStoreProvider>
  );
}

export const useEconomyAgentThreadStore = <T,>(
  selector: (store: EconomyAgentThreadStore) => T,
): T => {
  const agentStoreContext = useContext(EconomyAgentThreadStoreContext);

  if (!agentStoreContext) {
    throw new Error(
      "useEconomyAgentThreadStore must be used within AEconomyAgentThreadStoreProvider",
    );
  }

  return useStore(agentStoreContext, selector);
};
