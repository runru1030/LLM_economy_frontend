"use client";
import dynamic from "next/dynamic";
import { useSelectedLayoutSegments } from "next/navigation";

const ThreadListDrawer = dynamic(() => import("@widgets/economy-agent/ui/thread-list-drawer"), {
  ssr: false,
});
export default function Header() {
  const segments = useSelectedLayoutSegments();
  const OptionalLeftComponent = () => {
    if (segments.includes("economy-agent")) {
      const threadId = segments.length >= 2 ? segments[1] : null;
      return <ThreadListDrawer threadId={threadId} />;
    }
    return null;
  };
  return (
    <div className="h-15 flex items-center sticky top-0 left-0 px-4 bg-white border-b border-gray-100  font-extralight gap-2.5">
      <OptionalLeftComponent />
      LLM economy
    </div>
  );
}
