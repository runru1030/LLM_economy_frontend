import { useGetThreadsV1Query } from "src/lib/api-v1/query/useGetThreadsV1Query";

function useGetThreadList({ enabled = true }: { enabled?: boolean } = {}) {
  const { data, isLoading, error } = useGetThreadsV1Query({
    enabled,
  });
  return { data, isLoading, error };
}
export { useGetThreadList };
