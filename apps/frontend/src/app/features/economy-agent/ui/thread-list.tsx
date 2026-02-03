import clsx from "clsx";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { MdEditNote } from "react-icons/md";

function NewThreadButton({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/economy-agent"
      className="border-gray-200 rounded-full p-1 flex items-center gap-1 body3-regular text-gray-800 border size-8 justify-center"
      onClick={onClick}
    >
      <MdEditNote size={20} />
    </Link>
  );
}

function Item({
  subject,
  threadId,
  current,
  onClick,
}: { subject: string; threadId: string; current: boolean; onClick?: () => void }) {
  return (
    <div className={clsx("py-1 px-2 flex rounded-sm", current && "bg-gray-bg-100")}>
      <Link
        className="flex-1 caption1-regular text-left text-gray-800"
        href={`/economy-agent/${threadId}`}
        onClick={onClick}
      >
        {subject}
      </Link>
    </div>
  );
}
function ListContainer({ children }: PropsWithChildren<any>) {
  return <div className="py-1 flex flex-col gap-1 overflow-auto">{children}</div>;
}
const ThreadList = { Item, ListContainer };
export default ThreadList;
export { NewThreadButton };
