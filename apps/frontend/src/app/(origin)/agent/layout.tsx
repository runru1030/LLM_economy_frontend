import { AgentStoreProvider } from "@entities/agent/model/provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AgentStoreProvider>{children}</AgentStoreProvider>;
}
