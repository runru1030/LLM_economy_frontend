import { extend } from "lodash";

interface FileAttachment {
  url: string;
  key: string;
  name: string;
  type: string;
  size: number;
}

interface MessageOptions {
  model?: string;
  tools?: string[];
  allowTool?: "allow" | "deny";
  approveAllTools?: boolean; // if true, skip tool approval prompts
  attachments?: FileAttachment[];
}

interface MessageRequest {
  threadId: string;
  type: "human";
  content: string;
  model?: string;
  tools?: string[];
}

interface ToolCall {
  name: string;
  args: Record<string, unknown>;
  id: string;
  type: "tool_call";
}

interface ToolCallChunk {
  name: string;
  args: string;
  index: number;
  type: "tool_call_chunk";
  id: string;
}

interface FunctionCall {
  name: string;
  args: Record<string, unknown>;
}

interface ContentItem {
  text?: string;
  functionCall?: FunctionCall;
  thoughtSignature?: string;
}

interface AIMessageData {
  id: string;
  content: string | ContentItem[];
  tool_calls?: ToolCall[];
  tool_call_chunks?: ToolCallChunk[];
  additional_kwargs?: Record<string, unknown>;
  invalid_tool_calls?: unknown[];
  response_metadata?: Record<string, unknown>;
}

interface ToolMessageData {
  id: string;
  content: string;
  status: string;
  artifact?: unknown[];
  tool_call_id: string;
  name: string;
  metadata?: Record<string, unknown>;
  additional_kwargs?: Record<string, unknown>;
  response_metadata?: Record<string, unknown>;
}

interface BasicMessageData {
  id: string;
  content: string;
  attachments?: FileAttachment[];
}

interface ToolApprovalCallbacks {
  onApprove: (toolCallId: string) => void;
  onDeny: (toolCallId: string) => void;
}

interface MessageResponse {
  type: "human" | "ai" | "tool" | "error";

  data: BasicMessageData | AIMessageData | ToolMessageData;
}

interface MultimodalMessageContent {
  type: string;
  text?: string;
  image_url?: { url: string };
}

// Content item types for checkpoint-loaded messages
interface ImageUrlContentItem {
  type: "image_url";
  image_url?: { url: string };
  file_metadata?: FileAttachment;
  id?: string;
  name?: string;
}

interface TextContentItem {
  type: "text";
  text: string;
  file_metadata?: FileAttachment;
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
export type {
  Thread,
  ThreadDetail,
  FileAttachment,
  MessageOptions,
  MessageRequest,
  ToolCall,
  ToolCallChunk,
  ContentItem,
  AIMessageData,
  ToolMessageData,
  BasicMessageData,
  ToolApprovalCallbacks,
  MessageResponse,
  MultimodalMessageContent,
  ImageUrlContentItem,
  TextContentItem,
};
