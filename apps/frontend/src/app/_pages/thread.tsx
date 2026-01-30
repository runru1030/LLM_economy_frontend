import { Thread } from "@widgets/economy-agent/ui";

export default function ThreadPage({ threadId }: { threadId: string | null }) {
  return (
    <div className="flex flex-col h-full">
      <Thread threadId={threadId} />
    </div>
  );
}
