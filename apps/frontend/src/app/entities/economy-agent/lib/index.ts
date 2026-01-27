export * from "./stream";

function generateDummyId(type: "assistant" | "human"): string {
  return `msg_${type}_${Date.now()}`;
}
export { generateDummyId };
