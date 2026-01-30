import { MessageType } from "@entities/economy-agent/constants";
import { MessageResponse } from "@entities/economy-agent/types";
import { describe, expect, it } from "vitest";
import { getMessageContent, mergeChunk, parseChunk } from "../stream";
import { threadId } from "worker_threads";

describe("parseChunk", () => {
  it("assistant(amc) chunk를 올바르게 파싱한다", () => {
    const chunk = {
      type: "amc",
      id: "msg_1",
      data: "hello",
    } as any;

    expect(parseChunk(chunk)).toEqual({
      kind: "assistant",
      id: "msg_1",
      content: "hello",
    });
  });

  it("thread_start / thread_end 를 올바르게 파싱한다", () => {
    expect(parseChunk({ type: "thread_start" } as any)).toEqual({ kind: "ignore" });
    expect(parseChunk({ type: "thread_end" } as any)).toEqual({ kind: "end" });
  });

  it("알 수 없는 타입은 ignore 처리한다", () => {
    expect(parseChunk({ type: "unknown" } as any)).toEqual({ kind: "ignore" });
  });
});

describe("mergeChunk", () => {
  it("같은 AI 메시지가 없으면 새 메시지를 추가한다", () => {
    const messages: MessageResponse[] = [];

    const incoming: MessageResponse = {
      type: MessageType.AI,
      data: { id: "a1", content: "hello" },
    } as any;

    const result = mergeChunk(messages, incoming);
    expect(result).toHaveLength(1);
    expect(result[0].data?.content).toBe("hello");
  });

  it("같은 AI 메시지가 있으면 content를 이어붙인다", () => {
    const messages: MessageResponse[] = [
      {
        type: MessageType.AI,
        data: { id: "a1", content: "hello " },
      } as any,
    ];

    const incoming: MessageResponse = {
      type: MessageType.AI,
      data: { id: "a1", content: "world" },
    } as any;

    const result = mergeChunk(messages, incoming);

    expect(result[0].data?.content).toBe("hello world");
  });
});

describe("getMessageContent", () => {
  it("content가 string이면 그대로 반환한다", () => {
    const message: MessageResponse = {
      data: { content: "hello" },
    } as any;

    expect(getMessageContent(message)).toBe("hello");
  });

  it("content가 text array이면 텍스트만 병합한다", () => {
    const message: MessageResponse = {
      data: {
        content: [{ text: "hello " }, { text: "world" }],
      },
    } as any;

    expect(getMessageContent(message)).toBe("hello world");
  });

  it("file_metadata가 있는 항목은 무시한다", () => {
    const message: MessageResponse = {
      data: {
        content: [{ text: "hello " }, { file_metadata: { id: "file1" } }, { text: "world" }],
      },
    } as any;

    expect(getMessageContent(message)).toBe("hello world");
  });

  it("알 수 없는 content 타입이면 빈 문자열을 반환한다", () => {
    const message: MessageResponse = {
      data: { content: 123 },
    } as any;

    expect(getMessageContent(message)).toBe("");
  });
});
