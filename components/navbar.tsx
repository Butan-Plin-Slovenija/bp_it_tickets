"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Config } from "@/app/Config";

const links = [
  { href: "/", label: Config.home },
  { href: "/tickets", label: Config.myTickets },
  { href: "/help", label: Config.help },
];

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-semibold text-primary">
            {Config.siteName}
          </Link>

          <nav className="flex items-center gap-1">
            {links.map(({ href, label }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-accent font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <Avatar>
          <AvatarImage src="/avatar.png" alt="Avatar" />
          <AvatarFallback className="bg-primary text-primary-foreground">
            BP
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};
