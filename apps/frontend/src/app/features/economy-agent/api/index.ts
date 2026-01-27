import { ChatV1EconomyEconomyAgentThreadChatPostBody } from "src/lib/api-v1/mutation/useChatV1EconomyAgentChatPostMutation";

const ENDPOINT = "/v1/economy-agent/chat";
async function postChatStream({
  threadId,
  messages,
}: {
  threadId?: ChatV1EconomyEconomyAgentThreadChatPostBody["thread_id"];
  messages: ChatV1EconomyEconomyAgentThreadChatPostBody["messages"];
}) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ thread_id: threadId, messages }),
  });
  return res;
}

export { postChatStream };
