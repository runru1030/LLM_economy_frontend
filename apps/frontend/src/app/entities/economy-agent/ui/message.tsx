import clsx from "clsx";
import { getMessageContent } from "../lib";
import { MessageResponse } from "../types";
import { PropsWithChildren } from "react";
import MarkdownItem from "@shared/ui/markdown-item";

function AIMessageText({
  message,
  className,
}: {
  message: MessageResponse;
  className?: string;
}) {
  return (
    <div className={clsx(className, "py-1")}>
      <MarkdownItem content={getMessageContent(message)} />
    </div>
  );
}
function MessageText({
  message,
  className,
}: {
  message: MessageResponse;
  className?: string;
}) {
  return (
    <div className={clsx(className, "py-1.5 px-3 whitespace-pre-wrap body3-regular")}>
      <p>{getMessageContent(message)}</p>
    </div>
  );
}
function MessageContainer({
  className,
  children,
}: PropsWithChildren<{
  className?: string;
}>) {
  return (
    <div className={`flex gap-3 ${className}`}>
      <div className="max-w-full">{children}</div>
    </div>
  );
}
function AIMessage({ message }: { message: MessageResponse }) {
  return (
    <MessageContainer className="justify-start">
      <AIMessageText message={message} />
    </MessageContainer>
  );
}
function HumanMessage({ message }: { message: MessageResponse }) {
  return (
    <MessageContainer className="justify-end">
      <MessageText className="rounded-lg bg-gray-bg-200" message={message} />
    </MessageContainer>
  );
}
function ErrorMessage({ message }: { message: MessageResponse }) {
  return (
    <MessageContainer>
      <MessageText message={message} />
    </MessageContainer>
  );
}

export { AIMessage, ErrorMessage, HumanMessage };
