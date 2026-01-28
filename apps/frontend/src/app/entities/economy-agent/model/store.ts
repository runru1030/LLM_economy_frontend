import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";
import { MessageType } from "../constants";
import { mergeChunk, parseChunk } from "../lib";
import { APIThreadResponse, MessageResponse, ThreadDetail } from "../types";

interface States {
  threadDetail: ThreadDetail | null;
  isInitialThread: boolean;
  isSending: boolean;
  isPending: boolean;
}

interface Actions {
  setThreadDetail: (threadDetail: ThreadDetail) => void;
  appendMessage(msg: MessageResponse): void;
  updateMessageByChunk(chunk: unknown): void;
  setIsSending(loading: boolean): void;
}

const initialState: States = {
  threadDetail: null,
  isInitialThread: false,
  isSending: false,
  isPending: false,
};

export type EconomyAgentThreadStore = States & Actions;

export const createEconomyAgentThreadStore = () => {
  return createStore<EconomyAgentThreadStore>()(
    immer((set, get) => ({
      ...initialState,
      setThreadDetail: (threadDetail: ThreadDetail) => {
        // 서버 데이터 변환 예정
        set({
          threadDetail,
        });
      },
      appendMessage: (message: MessageResponse) => {
        set((state) => {
          const messages = state.threadDetail?.messages;
          if (
            !state.threadDetail ||
            !messages ||
            messages.some((m) => m.data.id === message.data.id)
          )
            return;

          const newMessages = [...messages, message];
          state.threadDetail.messages = newMessages;
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
            set({ isPending: true });
            break;
          case "assistant":
            set((state) => {
              state.isPending = false;

              if (!state.threadDetail) return;
              state.threadDetail.messages = mergeChunk(state.threadDetail.messages, {
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
