import { MessageResponse } from "../types";

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

export { getMessageContent };
