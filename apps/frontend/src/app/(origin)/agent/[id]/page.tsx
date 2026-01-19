import { AgentStoreDataInjector } from "@entities/agent/model/data-injector";
import ThreadPage from "src/app/_pages/thread";

export default async function Page({ params }: ThreadDetailProps) {
  const { id } = await params;

  return (
    <AgentStoreDataInjector threadId={id}>
      <ThreadPage />
    </AgentStoreDataInjector>
  );
}
