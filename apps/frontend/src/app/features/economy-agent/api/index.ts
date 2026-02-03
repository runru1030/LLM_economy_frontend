import { ChatV1Body } from "src/lib/api-v1/mutation/useChatV1Mutation";

const ENDPOINT = "/api/v1/economy-agent/chat";
async function postChatStream({
  threadId,
  messages,
}: {
  threadId?: ChatV1Body["thread_id"];
  messages: ChatV1Body["messages"];
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
