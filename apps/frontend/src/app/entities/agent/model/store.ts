import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";
import { MessageResponse, ThreadDetail } from "../types";

interface States {
  threadDetail: ThreadDetail | null;
  isInitialThread: boolean;
}

interface Actions {
  setThreadDetail: (threadDetail: ThreadDetail) => void;
}

const initialState: States = {
  threadDetail: null,
  isInitialThread: false,
};

export type AgentStore = States & Actions;

export const createAgentStore = () => {
  return createStore<AgentStore>()(
    immer((set, get) => ({
      ...initialState,
      setThreadDetail: (threadDetail: ThreadDetail) => {
        set((state) => {
          state.threadDetail = threadDetail;
        });
      },
    })),
  );
};
