import { MessageType } from "../constants";
import { APIThreadDetailResponse } from "../types";

function convertThreadDetailApiToClient(detail: APIThreadDetailResponse) {
  return {
    threadId: detail?.thread_id,
    thread: {
      title: "",
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    },
    messages: detail?.messages.map((msg) => ({
      type: msg.role === "assistant" ? MessageType.AI : MessageType.HUMAN,
      data: {
        id: msg.id || "",
        content: msg.content,
      },
    })),
  };
}
export { convertThreadDetailApiToClient };
