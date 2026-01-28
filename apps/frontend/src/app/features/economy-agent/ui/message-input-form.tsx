"use client";
import { MessageType } from "@entities/economy-agent/constants";
import { generateDummyId } from "@entities/economy-agent/lib";
import { useEconomyAgentThreadStore } from "@entities/economy-agent/model/provider";
import { clsx } from "clsx";
import React, { useRef } from "react";
import { MdArrowUpward, MdStop } from "react-icons/md";
import { useShallow } from "zustand/shallow";
import { postChatStream } from "../api";
import { fetchWithSSE } from "../lib";

// function AttachedFileList({
//   attachments,
//   setAttachments,
// }: {
//   attachments: FileAttachment[];
//   setAttachments: React.Dispatch<React.SetStateAction<FileAttachment[]>>;
// }) {
//   const handleRemoveAttachment = (key: string) => {
//     setAttachments((prev) => prev.filter((att) => att.key !== key));
//   };

//   return (
//     <>
//       {attachments.length > 0 && (
//         <div className="mb-2 flex flex-wrap gap-2">
//           {attachments.map((attachment) => (
//             <div
//               key={attachment.key}
//               className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5 text-sm dark:bg-gray-800"
//             >
//               <span className="max-w-50 truncate">{attachment.name}</span>
//               <span className="text-xs text-gray-500">
//                 (
//                 {attachment.size < 1024
//                   ? "<1KB"
//                   : `${(attachment.size / 1024).toFixed(0)}KB`}
//                 )
//               </span>
//               <button
//                 type="button"
//                 onClick={() => handleRemoveAttachment(attachment.key)}
//                 className="ml-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//                 aria-label="Remove attachment"
//               >
//                 x
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </>
//   );
// }

// function FileAttachmentInput({
//   disabled,
//   attachments,
// }: {
//   disabled?: boolean;
//   attachments: FileAttachment[];
// }) {
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const isUploading = false;

//   const handleFileUpload = async (files: FileList | null) => {
//     try {
//       if (!files || files.length === 0) return;

//       const remainingSlots = Math.max(0, MAX_ATTACHMENTS - attachments.length);
//       if (remainingSlots <= 0) {
//         alert(`You can attach up to ${MAX_ATTACHMENTS} files per message.`);
//         if (fileInputRef.current) fileInputRef.current.value = "";
//         return;
//       }

//       const formData = new FormData();
//       Array.from(files).forEach((file) => {
//         formData.append("file", file);
//       });
//       /* 파일 업로드 API */
//     } catch (error) {
//       console.error("File upload error:", error);
//     } finally {
//       if (fileInputRef.current) fileInputRef.current.value = "";
//     }
//   };

//   return (
//     <>
//       <input
//         ref={fileInputRef}
//         type="file"
//         multiple
//         accept="image/png,image/jpeg,application/pdf,text/markdown,text/plain,.md,.markdown,.txt"
//         onChange={(e) => handleFileUpload(e.target?.files)}
//         className="hidden"
//         aria-label="File upload"
//       />
//       <button
//         onClick={() => fileInputRef.current?.click()}
//         disabled={
//           disabled || isUploading || attachments.length >= MAX_ATTACHMENTS
//         }
//         className="h-8 w-8 rounded-full p-0"
//         aria-label="Attach file"
//       >
//         {isUploading ? "로딩중" : "+"}
//       </button>
//     </>
//   );
// }

const INPUT_NAME = "economy-agent-message-input";
function MessageInput({
  disabled,
  onEnter,
}: { disabled?: boolean; onEnter?: React.KeyboardEventHandler<HTMLTextAreaElement> }) {
  const handleResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onEnter?.(e);
    }
  };

  return (
    <textarea
      name={INPUT_NAME}
      placeholder={"메시지 입력"}
      className="max-h-50 min-h-10 w-full flex-1 resize-none overflow-auto pr-12 focus:outline-none bg-gray-bg-200 rounded-3xl py-2 text-sm px-3 "
      rows={1}
      aria-label="Message input"
      disabled={disabled}
      onKeyDown={handleKeyDown}
      onInput={handleResize}
    />
  );
}
function MessageSendButton({ disabled, isSending }: { disabled?: boolean; isSending: boolean }) {
  return (
    <button
      disabled={disabled}
      className={clsx(
        "flex size-8 cursor-pointer items-center justify-center rounded-full p-0 absolute right-2 bottom-1",
        "bg-gray-800 text-white",
      )}
      aria-label="Send message"
      type="submit"
    >
      {isSending ? <MdStop className="size-4" /> : <MdArrowUpward className="size-4" />}
    </button>
  );
}
function MessageInputForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const threadId = useEconomyAgentThreadStore((state) => state.threadDetail?.id);
  const [isSending, setIsSending] = useEconomyAgentThreadStore(
    useShallow((state) => [state.isSending, state.setIsSending]),
  );
  const updateMessageByChunk = useEconomyAgentThreadStore((state) => state.updateMessageByChunk);
  const appendMessage = useEconomyAgentThreadStore((state) => state.appendMessage);

  const handleSubmit = async () => {
    const form = formRef.current;
    if (!form) return;

    const textarea = form.elements.namedItem(INPUT_NAME);
    const message = (textarea as HTMLTextAreaElement)?.value.trim();
    if (!message) return;

    await fetchWithSSE({
      fetchFn: () =>
        postChatStream({
          threadId,
          messages: [{ type: "text", text: message }],
        }),
      onStart: () => {
        appendMessage({
          type: MessageType.HUMAN,
          data: {
            id: generateDummyId("human"),
            content: message,
          },
        });
        setIsSending(true);
        form.reset();
      },
      onChunk: updateMessageByChunk,
      onSettled: () => {
        setIsSending(false);
      },
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="p-2 pb-4 w-full"
      ref={formRef}
    >
      <div className="flex gap-2 relative">
        <MessageInput disabled={isSending} onEnter={handleSubmit} />
        <MessageSendButton disabled={isSending} isSending={isSending} />
      </div>
    </form>
  );
}
export { MessageInputForm };
