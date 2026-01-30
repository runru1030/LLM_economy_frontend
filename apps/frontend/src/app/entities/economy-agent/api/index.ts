import { useQuery } from "@tanstack/react-query";
import { threadHistoryV1EconomyAgentThreadThreadIdGetQueryKey } from "src/lib/api-v1/query/useThreadHistoryV1EconomyAgentThreadThreadIdGetQuery";

function getThreadDetailQueryOptions(threadId: string) {
  return {
    queryKey: threadHistoryV1EconomyAgentThreadThreadIdGetQueryKey({
      path: { thread_id: threadId },
    }),
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PROXY_API_URL}/v1/economy-agent/thread/${threadId}`,
      );
      if (!res.ok) {
        throw new Error("데이터를 가져오는데 실패했습니다.");
      }

      return res.json();
    },
  };
}
function useGetThreadDetail({ threadId }: { threadId: string }) {
  const query = useQuery(getThreadDetailQueryOptions(threadId));

  return { data: query.data, isLoading: query.isLoading, error: query.error };
}

export { getThreadDetailQueryOptions, useGetThreadDetail };
