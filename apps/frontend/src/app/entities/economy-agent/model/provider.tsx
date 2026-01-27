"use client";

import { PropsWithChildren, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import { EconomyAgentThreadStore, createEconomyAgentThreadStore } from "./store";

type EconomyAgentThreadApi = ReturnType<typeof createEconomyAgentThreadStore>;

const EconomyAgentThreadStoreContext = createContext<EconomyAgentThreadApi | undefined>(undefined);

export const EconomyAgentThreadStoreProvider = ({ children }: PropsWithChildren) => {
  const storeRef = useRef<EconomyAgentThreadApi>(null);

  if (!storeRef.current) {
    storeRef.current = createEconomyAgentThreadStore();
  }

  return (
    <EconomyAgentThreadStoreContext.Provider value={storeRef.current}>
      {children}
    </EconomyAgentThreadStoreContext.Provider>
  );
};

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
