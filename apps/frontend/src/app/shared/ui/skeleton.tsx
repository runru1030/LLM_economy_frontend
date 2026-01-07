import clsx from "clsx";

export function SkeletonUI({
  className,
  width = "100%",
  height = "100%",
}: {
  width?: string;
  height: string;
  className?: string;
}) {
  return (
    <div style={{ height, width }} className={clsx(`animate-pulse`, className)}>
      <div className="bg-gray-100 size-full rounded" />
    </div>
  );
}
