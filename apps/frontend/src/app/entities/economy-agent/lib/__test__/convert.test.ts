import { describe, it, expect } from "vitest";
import { convertThreadDetailApiToClient } from "../convert";
import { APIThreadDetailResponse } from "@entities/economy-agent/types";
import { MessageType } from "@entities/economy-agent/constants";

describe("convertThreadDetailApiToClient", () => {
  it("API 응답을 client thread detail 구조로 변환한다", () => {
    const apiResponse: APIThreadDetailResponse = {
      thread_id: "thread-123",
      messages: [
        {
          id: "msg-1",
          role: "user",
          content: [{ type: "text", text: "안녕" }],
        },
        {
          id: "msg-2",
          role: "assistant",
          content: [{ type: "text", text: "안녕하세요!" }],
        },
      ],
    };

    const result = convertThreadDetailApiToClient(apiResponse);

    expect(result).toEqual({
      threadId: "thread-123",
      thread: {
        title: "",
        createdAt: "2023-01-01T00:00:00Z",
        updatedAt: "2023-01-01T00:00:00Z",
      },
      messages: [
        {
          type: MessageType.HUMAN,
          data: {
            id: "msg-1",
            content: [{ type: "text", text: "안녕" }],
          },
        },
        {
          type: MessageType.AI,
          data: {
            id: "msg-2",
            content: [{ type: "text", text: "안녕하세요!" }],
          },
        },
      ],
    });
  });

  it("assistant가 아닌 role은 HUMAN으로 매핑된다", () => {
    const apiResponse: APIThreadDetailResponse = {
      thread_id: "thread-456",
      messages: [
        {
          id: "msg-3",
          role: "user",
          content: [{ type: "text", text: "테스트" }],
        },
      ],
    };

    const result = convertThreadDetailApiToClient(apiResponse);

    expect(result.messages[0].type).toBe(MessageType.HUMAN);
  });

  it("message id가 없으면 빈 문자열로 처리한다", () => {
    const apiResponse: APIThreadDetailResponse = {
      thread_id: "thread-789",
      messages: [
        {
          id: "",
          role: "assistant",
          content: [{ type: "text", text: "ID 없음" }],
        },
      ],
    };

    const result = convertThreadDetailApiToClient(apiResponse);

    expect(result.messages[0].data.id).toBe("");
  });
});
