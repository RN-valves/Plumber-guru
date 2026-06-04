"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  Bell,
  ExternalLink,
  LogOut,
  Menu,
  Search,
  Settings,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type TopBarProps = {
  onMenuClick: () => void;
  adminName: string;
  adminImage?: string | null;
};

type SearchResult = {
  id: string;
  type: "plumber" | "job" | "user";
  title: string;
  subtitle: string;
  href: string;
};

const MOCK_SEARCH: SearchResult[] = [
  {
    id: "1",
    type: "plumber",
    title: "Rahul Sharma",
    subtitle: "Mumbai · Verified plumber",
    href: "/admin/plumbers",
  },
  {
    id: "2",
    type: "job",
    title: "Bathroom leak repair",
    subtitle: "Delhi · Open job",
    href: "/admin/jobs",
  },
  {
    id: "3",
    type: "user",
    title: "Priya Mehta",
    subtitle: "Customer · Bangalore",
    href: "/admin/plumbers",
  },
  {
    id: "4",
    type: "plumber",
    title: "Amit Patel",
    subtitle: "Ahmedabad · Pending verification",
    href: "/admin/plumbers/verify",
  },
  {
    id: "5",
    type: "job",
    title: "Water heater installation",
    subtitle: "Pune · Reported",
    href: "/admin/jobs/reports",
  },
];

const NOTIFICATIONS = [
  {
    id: "n1",
    title: "New plumber registered",
    body: "Vikram Singh joined from Jaipur.",
    time: "2m ago",
    href: "/admin/plumbers",
  },
  {
    id: "n2",
    title: "Job reported",
    body: "Customer flagged job #PG-2841.",
    time: "18m ago",
    href: "/admin/jobs/reports",
  },
  {
    id: "n3",
    title: "Verification pending",
    body: "3 plumbers awaiting document review.",
    time: "1h ago",
    href: "/admin/plumbers/verify",
  },
  {
    id: "n4",
    title: "Forum post flagged",
    body: "Moderation queue has new items.",
    time: "3h ago",
    href: "/admin/community/forum",
  },
  {
    id: "n5",
    title: "Lead assigned",
    body: "New customer lead in Hyderabad.",
    time: "5h ago",
    href: "/admin/leads",
  },
] as const;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TopBar({ onMenuClick, adminName, adminImage }: TopBarProps) {
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const displayName = session?.user?.name || adminName;
  const displayImage = session?.user?.image || adminImage;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return MOCK_SEARCH.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.type.includes(q)
    ).slice(0, 6);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-gray-200/80 bg-white/80 px-4 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80 md:gap-4 md:px-8">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <Menu className="size-5" />
      </Button>

      <div ref={searchRef} className="relative min-w-0 flex-1 max-w-xl">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search plumbers, jobs, users…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            className="h-10 rounded-xl border-gray-200 bg-gray-50/80 pl-9 shadow-sm dark:border-gray-800 dark:bg-gray-900/50"
            aria-label="Global admin search"
            aria-expanded={searchOpen && results.length > 0}
          />
        </div>

        {searchOpen && query.trim() && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
            {results.length > 0 ? (
              <ul className="max-h-72 overflow-y-auto py-1">
                {results.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        setSearchOpen(false);
                        setQuery("");
                      }}
                      className="block px-3 py-2 hover:bg-muted"
                    >
                      <p className="text-sm font-medium text-foreground">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="capitalize">{item.type}</span>
                        {" · "}
                        {item.subtitle}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-3 py-4 text-sm text-muted-foreground">
                No results for &ldquo;{query}&rdquo;
              </p>
            )}
          </div>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="relative shrink-0"
              aria-label="Notifications"
            />
          }
        >
          <Bell className="size-5" />
          <Badge className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full p-0 text-[10px]">
            {NOTIFICATIONS.length}
          </Badge>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {NOTIFICATIONS.map((item) => (
            <DropdownMenuItem key={item.id} className="flex flex-col items-start gap-0.5 p-3">
              <Link href={item.href} className="w-full">
                <span className="text-sm font-medium">{item.title}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {item.body}
                </span>
                <span className="mt-1 block text-[10px] text-muted-foreground">
                  {item.time}
                </span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
              aria-label="Admin account menu"
            />
          }
        >
          <Avatar size="sm">
            {displayImage ? (
              <AvatarImage src={displayImage} alt={displayName} />
            ) : null}
            <AvatarFallback className="bg-primary text-xs text-white">
              {initials(displayName)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="font-normal">
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/" className="flex w-full items-center gap-2">
              <ExternalLink className="size-4" />
              View Site
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href="/admin/settings"
              className="flex w-full items-center gap-2"
            >
              <Settings className="size-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="size-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
