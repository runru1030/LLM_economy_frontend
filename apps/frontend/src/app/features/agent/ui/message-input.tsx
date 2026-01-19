"use client";
import { FileAttachment } from "@entities/agent/types";
import { FormEvent, useRef, useState } from "react";

const MAX_ATTACHMENTS = 3;

function FileAttachments({
  attachments,
  setAttachments,
}: {
  attachments: FileAttachment[];
  setAttachments: React.Dispatch<React.SetStateAction<FileAttachment[]>>;
}) {
  const removeAttachment = (key: string) => {
    setAttachments((prev) => prev.filter((att) => att.key !== key));
  };

  return (
    <>
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.key}
              className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5 text-sm dark:bg-gray-800"
            >
              <span className="max-w-[200px] truncate">{attachment.name}</span>
              <span className="text-xs text-gray-500">
                (
                {attachment.size < 1024
                  ? "<1KB"
                  : `${(attachment.size / 1024).toFixed(0)}KB`}
                )
              </span>
              <button
                type="button"
                onClick={() => removeAttachment(attachment.key)}
                className="ml-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label="Remove attachment"
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function FileAttachmentInput({ disabled }: { disabled?: boolean }) {
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = Math.max(0, MAX_ATTACHMENTS - attachments.length);
    if (remainingSlots <= 0) {
      alert(`You can attach up to ${MAX_ATTACHMENTS} files per message.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);

    try {
      const selectedFiles = Array.from(files).slice(0, remainingSlots);
      if (selectedFiles.length < files.length) {
        alert(
          `Only the first ${remainingSlots} file(s) were selected (max ${MAX_ATTACHMENTS} attachments).`,
        );
      }

      const uploadPromises = selectedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/agent/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Upload failed");
        }

        const data = await response.json();
        return {
          url: data.url,
          key: data.key,
          name: data.name,
          type: data.type,
          size: data.size,
        } as FileAttachment;
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setAttachments((prev) => [...prev, ...uploadedFiles]);
    } catch (error) {
      console.error("File upload error:", error);
      alert(error instanceof Error ? error.message : "Failed to upload files");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,application/pdf,text/markdown,text/plain,.md,.markdown,.txt"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="File upload"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={
          disabled || isUploading || attachments.length >= MAX_ATTACHMENTS
        }
        className="h-8 w-8 rounded-full p-0"
        aria-label="Attach file"
      >
        {isUploading ? "로딩중" : "+"}
      </button>
    </>
  );
}

function MessageInput() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      if ((!message.trim() && attachments.length === 0) || isLoading) return;
      setIsLoading(true);
      // await onSendMessage(message, {
      //   tools: [],
      //   attachments: attachments.length > 0 ? attachments : undefined,
      // });
      setMessage("");
      setAttachments([]);
    } catch (error) {
      console.error("Message send error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="pt-2 w-full pb-4">
      {/* Input Section */}
      <FileAttachments
        attachments={attachments}
        setAttachments={setAttachments}
      />
      <div className="flex gap-2">
        <FileAttachmentInput />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={"메시지 입력"}
          className="max-h-50 min-h-10 w-full flex-1 resize-none overflow-auto pr-12 focus:outline-none bg-gray-bg-200 rounded-full py-2 text-sm px-3"
          rows={1}
          aria-label="Message input"
          disabled={isLoading}
          onKeyDown={handleKeyDown}
        />

        <button
          disabled={(!message.trim() && attachments.length === 0) || isLoading}
          className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-0`}
          aria-label="Send message"
        >
          {isLoading ? "로딩중" : ">"}
        </button>
      </div>
    </form>
  );
}
export { MessageInput };
