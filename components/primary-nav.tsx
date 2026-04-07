"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/timeline", label: "타임라인" },
  { href: "/recommendations", label: "추천 결과" }
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export function PrimaryNav() {
  const pathname = usePathname();

  return (
    <nav className="grid grid-cols-3 gap-2 rounded-[24px] border border-white/80 bg-white/72 p-2 shadow-[0_20px_55px_-36px_rgba(31,71,138,0.5)] backdrop-blur-md">
      {navItems.map((item, index) => {
        const active = isActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group rounded-[18px] px-4 py-3 text-center transition ${
              active
                ? "bg-[linear-gradient(135deg,#2f6fe4,#4d86ee)] text-white shadow-[0_18px_40px_-24px_rgba(47,111,228,0.9)]"
                : "text-slate-500 hover:bg-white hover:text-slate-950"
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-70">
              0{index + 1}
            </div>
            <div className="mt-1 text-sm font-semibold sm:text-[15px]">{item.label}</div>
          </Link>
        );
      })}
    </nav>
  );
}
