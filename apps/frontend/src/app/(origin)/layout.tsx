import Header from "@widgets/common/ui/header";
import Nav from "@widgets/common/ui/nav";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Header />
      <div className="max-w-120 mx-auto h-[calc(100vh-60px)]">{children}</div>
      <Nav />
    </main>
  );
}
