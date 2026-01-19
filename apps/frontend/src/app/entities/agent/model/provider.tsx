"use client";

import { PropsWithChildren, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import { AgentStore, createAgentStore } from "./store";

type AgentApi = ReturnType<typeof createAgentStore>;

const AgentStoreContext = createContext<AgentApi | undefined>(undefined);

export const AgentStoreProvider = ({ children }: PropsWithChildren) => {
  const storeRef = useRef<AgentApi>(null);

  if (!storeRef.current) {
    storeRef.current = createAgentStore();
  }

  return (
    <AgentStoreContext.Provider value={storeRef.current}>
      {children}
    </AgentStoreContext.Provider>
  );
};

export const useAgentStore = <T,>(selector: (store: AgentStore) => T): T => {
  const agentStoreContext = useContext(AgentStoreContext);

  if (!agentStoreContext) {
    throw new Error(`useAgentStore must be used within AAgentStoreProvider`);
  }

  return useStore(agentStoreContext, selector);
};
