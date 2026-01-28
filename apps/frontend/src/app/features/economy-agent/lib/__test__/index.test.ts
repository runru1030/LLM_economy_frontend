import { describe, it, expect, vi } from "vitest";
import { fetchWithSSE } from "..";

function createMockResponse(chunks: string[]) {
  const encoder = new TextEncoder();

  return {
    body: {
      getReader() {
        let index = 0;
        return {
          async read() {
            if (index >= chunks.length) {
              return { done: true, value: undefined };
            }
            const value = encoder.encode(chunks[index++]);
            return { done: false, value };
          },
        };
      },
    },
  } as unknown as Response;
}

describe("fetchWithSSE", () => {
  it("SSE JSON chunk를 순서대로 onChunk로 전달한다", async () => {
    const onStart = vi.fn();
    const onChunk = vi.fn();
    const onSettled = vi.fn();

    const response = createMockResponse(['data: {"a":1}\r\n\r\n', 'data: {"b":2}\r\n\r\n']);

    const fetchFn = vi.fn().mockResolvedValue(response);

    await fetchWithSSE({
      fetchFn,
      onStart,
      onChunk,
      onSettled,
    });

    expect(onStart).toHaveBeenCalledOnce();
    expect(onChunk).toHaveBeenNthCalledWith(1, { a: 1 });
    expect(onChunk).toHaveBeenNthCalledWith(2, { b: 2 });
    expect(onSettled).toHaveBeenCalledOnce();
  });

  it("JSON이 아닌 이벤트는 skip한다", async () => {
    const onChunk = vi.fn();
    const onSettled = vi.fn();

    const response = createMockResponse(["data: hello\r\n\r\n", 'data: {"ok":true}\r\n\r\n']);

    const fetchFn = vi.fn().mockResolvedValue(response);

    await fetchWithSSE({
      fetchFn,
      onStart: vi.fn(),
      onChunk,
      onSettled,
    });

    expect(onChunk).toHaveBeenCalledOnce();
    expect(onChunk).toHaveBeenCalledWith({ ok: true });
  });

  it("fetch 에러 발생 시 onError를 호출한다", async () => {
    const error = new Error("network error");

    const fetchFn = vi.fn().mockRejectedValue(error);
    const onError = vi.fn();
    const onSettled = vi.fn();

    await fetchWithSSE({
      fetchFn,
      onStart: vi.fn(),
      onChunk: vi.fn(),
      onError,
      onSettled,
    });

    expect(onError).toHaveBeenCalledWith(error);
    expect(onSettled).toHaveBeenCalledOnce();
  });

  it("response.body가 없으면 조용히 종료한다", async () => {
    const fetchFn = vi.fn().mockResolvedValue({ body: null } as Response);

    const onChunk = vi.fn();
    const onSettled = vi.fn();

    await fetchWithSSE({
      fetchFn,
      onStart: vi.fn(),
      onChunk,
      onSettled,
    });

    expect(onChunk).not.toHaveBeenCalled();
    expect(onSettled).toHaveBeenCalledOnce();
  });
});
