"use client";
import { useEconomyAgentThreadStore } from "@entities/economy-agent/model/provider";
import { AIMessage, ErrorMessage, HumanMessage } from "@entities/economy-agent/ui";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";

function AIMessageSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-3">
      <span className=" caption2-medium text-gray-400">응답 생성 중 ...</span>
    </div>
  );
}

function MessageList() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const messages = useEconomyAgentThreadStore(
    useShallow((state) => state.threadDetail?.messages || []),
  );
  const isPending = useEconomyAgentThreadStore((state) => state.isPending);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full flex gap-3 flex-col">
      {messages.map((message) => {
        const messageID = message.data?.id || "";
        return {
          human: <HumanMessage key={messageID} message={message} />,
          ai: <AIMessage key={messageID} message={message} />,
          error: <ErrorMessage key={messageID} message={message} />,
          tool: null,
        }[message.type];
      })}
      {isPending && <AIMessageSkeleton />}
      <div ref={bottomRef} className="h-px" />
    </div>
  );
}
export { MessageList };
