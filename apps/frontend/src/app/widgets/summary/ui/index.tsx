"use client";
import { SummaryType } from "@entities/summary/types";
import { ContentBox, DateBox, KeywordBox, TypeBox } from "@entities/summary/ui";
import useInView from "@shared/hooks/use-in-view";
import { useEffect } from "react";
import { useGetInfiniteSummaryList } from "../api";
import { SkeletonUI } from "@shared/ui/skeleton";

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

function SummarySkeletonItem() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3 items-center">
        <SkeletonUI height="20px" width="50px" />
        <SkeletonUI height="20px" width="50px" />
      </div>
      <div className="flex-wrap flex gap-2">
        {Array.from({ length: 3 }).map((_, k) => (
          <SkeletonUI key={k} height="20px" width="80px" />
        ))}
      </div>
      <SkeletonUI height="80px" />
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
    <div className="flex flex-col gap-6 w-full">
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
      {isFetching &&
        Array.from({ length: 10 }).map((_, k) => (
          <SummarySkeletonItem key={k} />
        ))}
      <div className="min-h-0.5" ref={ref} />
    </div>
  );
}

export { SummaryList };
