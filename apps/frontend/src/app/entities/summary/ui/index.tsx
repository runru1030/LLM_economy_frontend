import { PropsWithChildren } from "react";
import { SummaryType } from "../types";
import { humantime } from "src/app/shared/lib/formatter";

function ContentBox({ children }: PropsWithChildren) {
  return (
    <div className="rounded-sm dark:bg-white/20 py-1.5 px-2.5 w-full bg-gray-50">
      {children}
    </div>
  );
}
function KeywordBox({ children }: PropsWithChildren) {
  return <div className="text-sm text-gray-400">{`#${children}`}</div>;
}

function TypeBox({ type }: { type: SummaryType }) {
  return { MK: <div className="text-sm">매일경제</div> }[type];
}

function DateBox({ date }: { date: Date }) {
  return <span className="text-gray-400 text-xs">{humantime(date)}</span>;
}
export { ContentBox, KeywordBox, TypeBox, DateBox };
