"use client";
import ThreadListDrawer from "@widgets/economy-agent/ui/thread-list-drawer";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import React, { useMemo } from "react";
import { MdArrowBackIos } from "react-icons/md";

enum SEGMENT {
  HOME = "home",
  ECONOMY_AGENT = "economy-agent",
}
const HEADER_CONTENT = {
  [SEGMENT.HOME]: {
    leftItem: undefined,
    rightItem: undefined,
    text: "LLM economy",
  },
  [SEGMENT.ECONOMY_AGENT]: {
    leftItem: () => (
      <Link href={"/"}>
        <MdArrowBackIos />
      </Link>
    ),
    rightItem: (threadId: string | null) => <ThreadListDrawer threadId={threadId} />,
    text: "economy Agent",
  },
} as const;

function HeaderContainer({
  text,
  leftItem,
  rightItem,
}: {
  text?: string;
  leftItem?: React.ReactNode;
  rightItem?: React.ReactNode;
}) {
  return (
    <div className="h-15 flex items-center sticky top-0 left-0 px-4 bg-white border-b border-gray-100  font-extralight gap-2.5 justify-between text-gray-800">
      <div className="flex items-center gap-2">
        {leftItem}
        {text}
      </div>
      {rightItem}
    </div>
  );
}
export default function Header() {
  const segments = useSelectedLayoutSegments();
  const key = useMemo(() => {
    if (segments.includes("economy-agent")) return SEGMENT.ECONOMY_AGENT;
    return SEGMENT.HOME;
  }, [segments]);
  const resourceId = segments.length >= 2 ? segments[1] : null;

  return (
    <HeaderContainer
      leftItem={HEADER_CONTENT[key].leftItem?.()}
      rightItem={HEADER_CONTENT[key].rightItem?.(resourceId)}
      text={HEADER_CONTENT[key].text}
    />
  );
}
