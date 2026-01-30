import { getThreadDetailQueryOptions } from "@entities/economy-agent/api";
import { EconomyAgentThreadStoreProviderWithInit } from "@entities/economy-agent/model/provider";
import { ThreadDetailProps } from "@shared/types/gloabl";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import ThreadPage from "src/app/_pages/thread";

export default async function Page({ params }: ThreadDetailProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(getThreadDetailQueryOptions(id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EconomyAgentThreadStoreProviderWithInit threadId={id}>
        <ThreadPage threadId={id} />
      </EconomyAgentThreadStoreProviderWithInit>
    </HydrationBoundary>
  );
}
