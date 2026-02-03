import { MessageType } from "../constants";
import { APIThreadDetailResponse } from "../types";

function convertThreadDetailApiToClient(detail: APIThreadDetailResponse) {
  return {
    threadId: detail.metadata.thread_id,
    thread: {
      title: detail.metadata.subject,
      createdAt: detail.metadata.created_at,
      updatedAt: detail.metadata.updated_at,
    },
    messages: detail.messages.map((msg) => ({
      type: msg.role === "assistant" ? MessageType.AI : MessageType.HUMAN,
      data: {
        id: msg.id,
        content: msg.content,
      },
    })),
  };
}
export { convertThreadDetailApiToClient };
