import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";
import { MessageType } from "../constants";
import { mergeChunk, parseChunk } from "../lib";
import { APIThreadDetailResponse, APIThreadResponse, MessageResponse, Thread } from "../types";
import { convertThreadDetailApiToClient } from "../lib/convert";

interface States {
  thread: Thread | null;
  threadId: string | null;
  messages: MessageResponse[];
  isInitialThread: boolean;
  isSending: boolean;
  isPending: boolean;
}

interface Actions {
  appendMessage(msg: MessageResponse): void;
  updateMessageByChunk(chunk: unknown): void;
  setIsSending(loading: boolean): void;
}

const initialState: States = {
  thread: null,
  threadId: null,
  messages: [],
  isInitialThread: false,
  isSending: false,
  isPending: false,
};

export type EconomyAgentThreadStore = States & Actions;

export const createEconomyAgentThreadStore = (initialData?: APIThreadDetailResponse) => {
  const initialThreadData = initialData ? convertThreadDetailApiToClient(initialData) : {};
  return createStore<EconomyAgentThreadStore>()(
    immer((set, get) => ({
      ...initialState,
      ...initialThreadData,
      appendMessage: (message: MessageResponse) => {
        set((state) => {
          const messages = state.messages;
          if (!messages || messages.some((m) => m.data.id === message.data.id)) return;

          const newMessages = [...messages, message];
          state.messages = newMessages;
        });
      },
      setIsSending: (loading: boolean) => {
        set((state) => {
          state.isSending = loading;
        });
      },
      updateMessageByChunk: (chunk) => {
        // 타입 체크 필요
        const parsed = parseChunk(chunk as APIThreadResponse);

        switch (parsed.kind) {
          case "start":
            set((state) => {
              state.isPending = true;
              if (!state.threadId) state.threadId = parsed.threadId;
            });
            break;
          case "assistant":
            set((state) => {
              state.isPending = false;
              state.messages = mergeChunk(state.messages, {
                type: MessageType.AI,
                data: parsed,
              });
            });
            break;
          case "end":
            set({ isPending: false });
            break;
        }
      },
    })),
  );
};
