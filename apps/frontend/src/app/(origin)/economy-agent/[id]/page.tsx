import { EconomyAgentThreadStoreDataInjector } from "@entities/economy-agent/model/data-injector";
import { ThreadDetailProps } from "@shared/types/gloabl";
import ThreadPage from "src/app/_pages/thread";

export default async function Page({ params }: ThreadDetailProps) {
  const { id } = await params;

  return (
    <EconomyAgentThreadStoreDataInjector threadId={id}>
      <ThreadPage />
    </EconomyAgentThreadStoreDataInjector>
  );
}
