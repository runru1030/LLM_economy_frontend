"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { MdSms } from "react-icons/md";

const NAV_ITEMS = [{ label: "에이전트", href: "/economy-agent", icon: () => <MdSms size={24} /> }];
function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-gray-stroke-100 flex flex-col items-center bg-gray-800 size-13 rounded-full justify-center shadow-2xl"
      >
        <span className="flex items-center">{icon}</span>
        <span className="text-[8px]">{label}</span>
      </Link>
    </li>
  );
}

function FloatingNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed left-2 bottom-4">
      <ul className="flex flex-col gap-4">
        {NAV_ITEMS.filter((nav) => !pathname.includes(nav.href)).map((item) => (
          <NavItem href={item.href} icon={item.icon()} label={item.label} key={item.href} />
        ))}
      </ul>
    </nav>
  );
}
export default FloatingNav;
