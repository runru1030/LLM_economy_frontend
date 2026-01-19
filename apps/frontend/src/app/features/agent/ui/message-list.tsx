"use client";
import { useAgentStore } from "@entities/agent/model/provider";
import { AIMessage, ErrorMessage, HumanMessage } from "@entities/agent/ui";
import { useShallow } from "zustand/react/shallow";

function MessageList() {
  const messages = useAgentStore(
    useShallow((state) => state.threadDetail?.messages || []),
  );
  return (
    <div className="flex gap-3 flex-col w-full">
      {messages.map((message) => {
        const messageID = message.data?.id || "";
        return {
          human: <HumanMessage key={messageID} message={message} />,
          ai: <AIMessage key={messageID} message={message} />,
          error: <ErrorMessage key={messageID} message={message} />,
          tool: null,
        }[message.type];
      })}
    </div>
  );
}
export { MessageList };
