import { components } from "src/lib/api-v1/paths";
import { MessageType } from "../constants";
import { ThreadHistoryV1EconomyAgentThreadThreadIdGetData } from "src/lib/api-v1/query/useThreadHistoryV1EconomyAgentThreadThreadIdGetQuery";

// api

type APIThreadResponse = components["schemas"]["ThreadResponse"];
type APIThreadDetailResponse = ThreadHistoryV1EconomyAgentThreadThreadIdGetData;

// client types
interface MessageRequest {
  threadId: string;
  type: MessageType.HUMAN;
  data: string;
}

interface TextContentItem {
  type: "text";
  text: string;
}

interface AIMessageData {
  id: string;
  content: string | TextContentItem[];
}

interface BasicMessageData {
  id: string;
  content: string | TextContentItem[];
}

interface MessageResponse {
  type: MessageType;
  data: BasicMessageData | AIMessageData;
}

interface Thread {
  title?: string;
  createdAt: string;
  updatedAt: string;
}

export type { APIThreadResponse, APIThreadDetailResponse };
export type {
  AIMessageData,
  BasicMessageData,
  MessageRequest,
  MessageResponse,
  TextContentItem,
  Thread,
};
