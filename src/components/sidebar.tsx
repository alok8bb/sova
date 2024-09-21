"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  House,
  SquareChartGantt,
  Book,
  ChartCandlestick,
  Telescope,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { name: "Home", href: "/dashboard", icon: House },
  { name: "Tools", href: "/dashboard/tools", icon: SquareChartGantt },
  { name: "Learn", href: "/dashboard/learn", icon: Book },
  { name: "Trade", href: "/dashboard/trade", icon: ChartCandlestick },
  {
    name: "Explorer",
    href: "/dashboard/explorer",
    icon: Telescope,
  },
];

export default function Sidebar({
  isCollapsed,
  setCollapsed,
}: {
  isCollapsed: boolean;
  setCollapsed: (value: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen ease-in-out duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md border">
        <Button
          className={cn("transition-transform ease-in-out duration-300 mb-1")}
          variant="link"
          asChild
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-white"
          >
            <LayoutDashboard className="w-6 h-6 mr-1" />
            {!isCollapsed && (
              <h1
                className={cn(
                  "font-bold text-lg whitespace-nowrap ease-in-out duration-300"
                )}
              >
                Solaris Board
              </h1>
            )}
          </Link>
        </Button>
        <nav className="space-y-2 mt-5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 p-2 ${
                  isCollapsed ? "px-2" : "px-4"
                } rounded-lg transition-colors ${
                  isActive
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
        <Button
          className="absolute bottom-4 right-2"
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}
