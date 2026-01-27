"use client";
import type { SummaryItem } from "@entities/summary/types";
import { ContentBox, DateBox, KeywordBox, LinkBox, TypeBox } from "@entities/summary/ui";
import useInView from "@shared/hooks/use-in-view";
import { SkeletonUI } from "@shared/ui/skeleton";
import { useEffect } from "react";
import { useGetInfiniteSummaryList } from "../api";

function SummaryItem({ content, keywords, author, publishedAt, url }: SummaryItem) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <TypeBox>{author}</TypeBox>
        {url && <LinkBox url={url} />}
        <DateBox date={new Date(publishedAt)} />
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
      params: {},
    });

  const { ref } = useInView({
    enabled: hasNextPage && !isFetching,
    onInteract: fetchNextPage,
  });

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  useEffect(() => {
    // 새로 고침 시 스크롤 맨 위로 이동
    window.onbeforeunload = function pushRefresh() {
      window.scrollTo(0, 0);
    };
  }, []);

  if (error) return <>something wrong..{error?.detail}</>;
  if (isSuccess && data?.pages.length === 0) return <>없어용</>;

  return (
    <div className="flex flex-col gap-6 w-full">
      {data?.pages
        .flatMap((page) => page.summaries)
        .map((summary) => (
          <SummaryItem
            author={summary.author}
            content={summary.content}
            keywords={summary.keywords}
            publishedAt={summary.published_at}
            key={summary.created_at}
            url={summary.url}
          />
        ))}
      {isFetching && Array.from({ length: 10 }).map((_, k) => <SummarySkeletonItem key={k} />)}
      <div className="min-h-0.5" ref={ref} />
    </div>
  );
}

export { SummaryList };
