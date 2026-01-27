import { components } from "src/lib/api-v1/paths";
import { MessageType } from "../constants";

// api
type APIThreadResponse = components["schemas"]["ThreadResponse"];

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
  id: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

interface ThreadDetail extends Thread {
  messages: MessageResponse[];
}
export type { APIThreadResponse };
export type {
  AIMessageData,
  BasicMessageData,
  MessageRequest,
  MessageResponse,
  TextContentItem,
  Thread,
  ThreadDetail,
};
