function Header() {
  return (
    <div className="h-15 flex items-center sticky top-0 left-0 px-4 bg-white border-b border-gray-100 mb-5 font-extralight">
      LLM economy
    </div>
  );
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Header />
      <div className="max-w-120 mx-auto">{children}</div>
    </main>
  );
}
