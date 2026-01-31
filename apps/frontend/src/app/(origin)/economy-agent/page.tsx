import { EconomyAgentThreadStoreProvider } from "@entities/economy-agent/model/provider";
import ThreadPage from "src/app/_pages/thread";

export default async function Page() {
  return (
    <EconomyAgentThreadStoreProvider>
      <ThreadPage threadId={null} />;
    </EconomyAgentThreadStoreProvider>
  );
}
