import Link from "next/link";
import { PropsWithChildren } from "react";
import { humantime } from "src/app/shared/lib/formatter";
import { MdLink } from "react-icons/md";

function ContentBox({ children }: PropsWithChildren) {
  return (
    <div className="rounded-sm py-1.5 px-2.5 w-full bg-gray-100">
      {children}
    </div>
  );
}
function KeywordBox({ children }: PropsWithChildren) {
  return <div className="text-sm text-gray-500">{`#${children}`}</div>;
}

function TypeBox({ children }: PropsWithChildren) {
  return <span>{children}</span>;
}

function DateBox({ date }: { date: Date }) {
  return <span className="text-gray-400 text-xs">{humantime(date)}</span>;
}

function LinkBox({ url }: { url: string }) {
  return (
    <Link href={url} target="_blank">
      <MdLink className="size-5 text-blue-400 hover:text-blue-600 active:text-blue-600" />
    </Link>
  );
}
export { ContentBox, KeywordBox, TypeBox, DateBox, LinkBox };
