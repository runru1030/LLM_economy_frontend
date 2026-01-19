type DefaultSearchParams = { [key: string]: string | string[] };

declare interface BasePageProps<T, U> {
  params: T;
  searchParams?: U;
}

declare interface BaseLayoutProps<T> {
  children: React.ReactNode;
  params: T;
}

declare interface ThreadDetailParams {
  id: string;
}
declare type ThreadDetailLayoutProps = BaseLayoutProps<ThreadDetailParams>;

declare type ThreadDetailProps<T = DefaultSearchParams> = BasePageProps<
  ThreadDetailParams,
  T
>;
