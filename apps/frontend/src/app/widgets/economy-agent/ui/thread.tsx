import { MessageInputForm, MessageList } from "@features/economy-agent/ui";
import { ThreadSyncNavigator } from "../lib/thread-checker";

function Thread({ threadId }: { threadId: string | null }) {
  return (
    <>
      <ThreadSyncNavigator threadId={threadId} />
      <div className="flex flex-col flex-1 h-full">
        <div className="min-h-0 flex-1 h-full overflow-auto px-4 pt-5">
          <MessageList />
        </div>
        <div className="shrink-0">
          <MessageInputForm />
        </div>
      </div>
    </>
  );
}
export { Thread };
