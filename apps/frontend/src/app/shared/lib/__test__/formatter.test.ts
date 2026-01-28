import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { humantime } from "../formatter";

describe("humantime", () => {
  beforeEach(() => {
    // 기준 시간을 고정
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("현재 시각과 동일한 경우 '0초 전'을 반환한다", () => {
    const now = new Date("2026-01-01T00:00:00Z");
    expect(humantime(now)).toBe("0초 전");
  });

  it("과거 시간에 대해 올바른 한국어 상대 시간을 반환한다", () => {
    const past = new Date("2025-12-31T23:59:00Z"); // 1분 전
    expect(humantime(past)).toBe("1분 전");
  });

  it("미래 시간에 대해 올바른 한국어 상대 시간을 반환한다", () => {
    const future = new Date("2026-01-01T00:01:00Z"); // 1분 후
    expect(humantime(future)).toBe("1분 후");
  });

  it("잘못된 Date가 들어오면 빈 문자열을 반환한다", () => {
    const invalidDate = new Date("invalid");
    expect(humantime(invalidDate)).toBe("");
  });
});
