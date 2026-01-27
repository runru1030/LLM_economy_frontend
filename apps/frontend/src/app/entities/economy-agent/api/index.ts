import { useQuery } from "@tanstack/react-query";
import { ThreadDetail } from "../types";

const mockThreadDetail: ThreadDetail = {
  id: "thread_001",
  title: "오늘 시장 요약",
  createdAt: "2026-01-19T09:00:00Z",
  updatedAt: "2026-01-19T09:06:30Z",

  messages: [],
};

const ENDPOINT = "/api/agent/thread-detail";
interface ThreadDetailParams {
  threadId: string;
}
const getThreadDetailQueryKey = (params?: ThreadDetailParams): readonly unknown[] =>
  params ? [ENDPOINT, params] : [ENDPOINT];

function useGetThreadDetail({ threadId }: ThreadDetailParams) {
  const query = useQuery({
    queryKey: getThreadDetailQueryKey({ threadId }),
    queryFn: async () => {
      // In real implementation, fetch from API
      return mockThreadDetail;
    },
  });

  return { data: query.data, isLoading: query.isLoading, error: query.error };
}

export { getThreadDetailQueryKey, useGetThreadDetail };
