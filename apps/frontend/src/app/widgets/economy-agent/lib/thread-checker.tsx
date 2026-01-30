"use client";

import { useEconomyAgentThreadStore } from "@entities/economy-agent/model/provider";
import { useEffect } from "react";

function ThreadSyncNavigator({ threadId }: { threadId: string | null }) {
  const threadIdFromStore = useEconomyAgentThreadStore((state) => state.threadId);

  useEffect(() => {
    if (threadId === null && threadIdFromStore) {
      window.history.replaceState(null, "", `/economy-agent/${threadIdFromStore}`);
    }
  }, [threadId, threadIdFromStore]);
  return null;
}
export { ThreadSyncNavigator };
