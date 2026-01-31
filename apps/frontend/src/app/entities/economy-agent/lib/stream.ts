import { components } from "src/lib/api-v1/paths";
import { MessageType } from "../constants";
import { MessageResponse } from "../types";

type ParsedChunk =
  | {
      kind: "assistant";
      id: string;
      content: string;
    }
  | { kind: "start"; threadId: string }
  | { kind: "end" }
  | { kind: "ignore" };

function hasStringKey<K extends string>(value: unknown, key: K): value is Record<K, string> {
  return typeof value === "object" && value !== null && key in value;
}

function parseChunk(chunk: components["schemas"]["ThreadResponse"]): ParsedChunk {
  switch (chunk.type) {
    case "amc":
      if (!hasStringKey(chunk, "data")) return { kind: "ignore" };
      return {
        kind: "assistant",
        id: chunk.id,
        content: chunk.data,
      };
    case "thread_start":
      if (!hasStringKey(chunk, "data") || !hasStringKey(chunk.data, "thread_id"))
        return { kind: "ignore" };
      return { kind: "start", threadId: chunk.data.thread_id };
    case "thread_end":
      return { kind: "end" };
    default:
      return { kind: "ignore" };
  }
}

function mergeChunk(messages: MessageResponse[], incoming: MessageResponse) {
  const new_messages = [...messages];
  const idx = new_messages.findIndex(
    (m) => m.type === MessageType.AI && m.data?.id === incoming.data.id,
  );

  if (idx === -1) {
    return [...new_messages, incoming];
  }

  const current = new_messages[idx].data;

  new_messages[idx].data = {
    ...current,
    ...incoming.data,
    content:
      typeof current.content === "string" && typeof incoming.data.content === "string"
        ? current.content + incoming.data.content
        : incoming.data.content,
  };

  return messages;
}

function getMessageContent(message: MessageResponse): string {
  if (typeof message.data?.content === "string") {
    return message.data.content;
  }
  if (Array.isArray(message.data?.content)) {
    const textParts = message.data.content
      .filter((item: unknown) => {
        if (typeof item === "object" && item !== null) {
          const obj = item as Record<string, unknown>;
          if ("file_metadata" in obj && obj.file_metadata) {
            return false;
          }
          return "text" in obj && typeof obj.text === "string";
        }
        return typeof item === "string";
      })
      .map((item: unknown) => {
        if (typeof item === "string") {
          return item;
        }
        if (typeof item === "object" && item !== null) {
          const obj = item as Record<string, unknown>;
          return typeof obj.text === "string" ? obj.text : "";
        }
        return "";
      });
    return textParts.join("");
  }
  return "";
}

export { mergeChunk, parseChunk, getMessageContent };
