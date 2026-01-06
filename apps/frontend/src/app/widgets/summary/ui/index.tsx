"use client";
import { SummaryType } from "@entities/summary/types";
import { ContentBox, DateBox, KeywordBox, TypeBox } from "@entities/summary/ui";
import useInView from "@shared/hooks/use-in-view";
import { useEffect } from "react";
import { useGetInfiniteSummaryList } from "../api";

function SummaryItem({
  content,
  keywords,
  type,
  createdAt,
}: {
  content: string;
  keywords: string[];
  type: SummaryType;
  createdAt: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3 items-center">
        <TypeBox type={type} />
        <DateBox date={new Date(createdAt)} />
      </div>
      <div className="flex-wrap flex gap-2">
        {keywords.map((k) => (
          <KeywordBox key={k}>{k}</KeywordBox>
        ))}
      </div>
      <ContentBox>{content}</ContentBox>
    </div>
  );
}

function SummaryList() {
  const { data, hasNextPage, fetchNextPage, isFetching, isSuccess, error } =
    useGetInfiniteSummaryList({
      params: { query: {} },
    });

  const { ref } = useInView({
    enabled: hasNextPage && !isFetching,
    onInteract: fetchNextPage,
  });

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  if (error) return <>something wrong..{error?.detail}</>;
  if (isSuccess && data?.pages.length === 0) return <>없어용</>;

  return (
    <div className="flex flex-col gap-6">
      {data?.pages
        .flatMap((page) => page.summaries)
        .map((summary) => (
          <SummaryItem
            content={summary.content}
            createdAt={summary.created_at}
            keywords={summary.keywords}
            type="MK"
            key={summary.created_at}
          />
        ))}
      <div className="min-h-0.5" ref={ref} />
    </div>
  );
}

export { SummaryList };
