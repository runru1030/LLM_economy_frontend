function parseSSEText(text: string): string[] {
  return text
    .split("\r\n\r\n")
    .map((line) => line.replace(/^data:\s*/, "").trim())
    .filter(Boolean);
}

async function fetchWithSSE({
  fetchFn,
  onChunk,
  onStart,
  onError,
  onSettled,
}: {
  fetchFn: () => Promise<Response>;
  onStart: () => void;
  onChunk: (chunk: unknown) => void;
  onError?: (error: unknown) => void;
  onSettled: () => void;
}) {
  try {
    onStart();
    const res = await fetchFn();

    if (!res.body) return;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      const events = parseSSEText(text);
      for (const raw of events) {
        try {
          const parsed = JSON.parse(raw);
          onChunk(parsed);
        } catch (_) {
          console.warn("skip non-json event", raw);
        }
      }
    }
  } catch (error) {
    console.error("Message send error:", error);
    onError?.(error);
  } finally {
    onSettled();
  }
}
export { fetchWithSSE };
