import React from "react";
import { EconomyAgentThreadStoreProvider } from "@entities/economy-agent/model/provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <EconomyAgentThreadStoreProvider>{children}</EconomyAgentThreadStoreProvider>;
}
