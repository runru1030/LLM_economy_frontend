import Header from "@widgets/common/ui/header";
import FloatingNav from "@widgets/common/ui/floating-nav";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Header />
      <div className="max-w-120 mx-auto h-[calc(100vh-48px)] overflow-auto">{children}</div>
      <FloatingNav />
    </main>
  );
}
